import {AddCircle, ContentCopy, Delete, Deselect, RestoreFromTrash, Save, SelectAll, ToggleOff, ToggleOn} from '@mui/icons-material';
import {Chip, CircularProgress, IconButton, Tooltip, Typography} from '@mui/material';
import classNames from 'classnames';
import MUIDataTable from 'mui-datatables';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {getProfile} from '../../api/profileApi';
import {defaultOptions} from '../../configs/muiDataTable';
import {useAuth} from '../../security/AuthProvider';
import {useSocket} from '../../security/SocketProvider';
import {theme} from '../../styles/theme';
import {useSnackBar} from '../../utils/snackBar';
import {useInterval} from '../../utils/useInterval';
import {useStyles} from './accessStyles';
import {SelectScopes} from './selectScopes/SelectScopes';
import {SelectUsers} from './selectUsers/SelectUsers';

export const Access = memo(() => {
  const SESSION_STORAGE_KEY = 'REACT_APP_ACCESS_PATCH';

  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingPermissions, setIsPendingPermissions] = useState(true);
  const [isPendingUsers, setIsPendingUsers] = useState(true);
  const [isPendingScopes, setIsPendingScopes] = useState(true);
  const [delay, setDelay] = useState(3000);
  const [logged, session] = useAuth();
  const socket = useSocket();
  const {showSuccess, showWarning, showError} = useSnackBar();
  const [permissions, setPermissions] = useState(null);
  const [users, setUsers] = useState(null);
  const [scopes, setScopes] = useState({});
  const [patch, setPatch] = useState(null);
  const [copiedScopes, setCopiedScopes] = useState([]);
  const [userIdOfScopeEditing, setUserIdOfScopeEditing] = useState(null);
  const [openSelectUsers, setOpenSelectUsers] = useState(false);
  const [openSelectScopes, setOpenSelectScopes] = useState(false);

  useEffect(() => {
    setIsLoading(isPendingPermissions || isPendingUsers || isPendingScopes);
  }, [isPendingPermissions, isPendingScopes, isPendingUsers]);

  useEffect(() => {
    if (logged && socket) {
      socket.on('permission:permissions', r => {
        if (r.status === 403) {
          showWarning(r?.data);
          socket?.removeAllListeners('permission:permissions');
          setDelay(null);
        } else {
          setPermissions(r?.data);
        }
        setIsPendingPermissions(false);
      });
    } else {
      setPermissions(null);
    }
    return () => {
      socket?.removeAllListeners('permission:permissions');
    };
  }, [logged, showWarning, socket]);

  useInterval(() => {
    if (logged && socket) {
      socket.emit('permission:permissions', session.access_token);
    }
  }, delay, [logged, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('permission:getUsers', data => {
        setUsers(data.reduce((acc, user) => ({
          ...acc,
          [user.id]: user,
        }), {}));
        setIsPendingUsers(false);
      });
    }
    return () => setUsers(null);
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('permission:getScopesDictionary', data => {
        setScopes(data.SCOPES);
        setIsPendingScopes(false);
      });
    }
    return () => setScopes({});
  }, [socket]);

  useEffect(() => {
    if (!patch) {
      setPatch(() => {
        const sessionPatch = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));

        if (sessionPatch) {
          return sessionPatch;
        } else {
          return {created: [], deleted: [], updated: []};
        }
      });
    }
  }, [patch]);

  const updatePatch = useCallback((onSetPatch) => {
    setPatch(oldPatch => {
      const newPatch = onSetPatch(oldPatch);

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newPatch));
      return newPatch;
    });
  }, []);

  const clonePatch = useCallback((oldPatch) => ({
    ...oldPatch,
    created: [...oldPatch.created],
    deleted: [...oldPatch.deleted],
    updated: [...oldPatch.updated],
  }), []);

  const concatCreatedToPermissions = useCallback(
    oldPatch =>
      permissions.concat(oldPatch.created),
    [permissions],
  );

  const convertDataIndexToUserId = useCallback(
    (oldPatch, dataIndex) =>
      concatCreatedToPermissions(oldPatch)[dataIndex]?.user_id,
    [concatCreatedToPermissions],
  );

  const findPermission = useCallback(
    (oldPatch, userId) =>
      concatCreatedToPermissions(oldPatch).find(permission => permission.user_id === userId),
    [concatCreatedToPermissions],
  );

  const findUpdated = useCallback(
    (oldPatch, userId) =>
      oldPatch.updated.find(permission => userId === permission.user_id),
    [],
  );

  const findUpdatedOrPermission = useCallback(
    (oldPatch, userId) =>
      findUpdated(oldPatch, userId) ?? findPermission(oldPatch, userId),
    [findPermission, findUpdated],
  );

  const isWhiteListPermission = useCallback(
    (oldPatch, userId) =>
      findUpdated(oldPatch, userId)?.isWhiteList
      ?? findPermission(oldPatch, userId)?.isWhiteList
      ?? true,
    [findPermission, findUpdated],
  );

  const findPermissionScopes = useCallback(
    (oldPatch, userId) =>
      findPermission(oldPatch, userId)?.scopes,
    [findPermission],
  );

  const subtractPermissionFromUpdated = useCallback(
    (oldPatch, userId) =>
      oldPatch.updated.filter(permission => permission.user_id !== userId),
    [],
  );

  const findUpdatedScopes = useCallback(
    (oldPatch, userId) =>
      findUpdated(oldPatch, userId)?.scopes,
    [findUpdated],
  );

  const findUpdatedOrPermissionScopes = useCallback(
    (oldPatch, userId) =>
      findUpdatedScopes(oldPatch, userId) ?? findPermissionScopes(oldPatch, userId) ?? [],
    [findPermissionScopes, findUpdatedScopes],
  );

  const subtractUpdatedFromPermissionScopes = useCallback(
    (oldPatch, userId) =>
      findPermissionScopes(oldPatch, userId).filter(item => !(findUpdatedScopes(oldPatch, userId)?.includes(item) ?? true)),
    [findPermissionScopes, findUpdatedScopes],
  );

  const subtractPermissionFromUpdatedScopes = useCallback(
    (oldPatch, userId) =>
      (findUpdatedScopes(oldPatch, userId) ?? []).filter(item => !findPermissionScopes(oldPatch, userId).includes(item)),
    [findPermissionScopes, findUpdatedScopes],
  );

  const isUpdatedAndPermissionScopesEqual = useCallback(
    (oldPatch, userId) =>
      subtractUpdatedFromPermissionScopes(oldPatch, userId).length === 0 && subtractPermissionFromUpdatedScopes(oldPatch, userId).length === 0,
    [subtractPermissionFromUpdatedScopes, subtractUpdatedFromPermissionScopes],
  );

  const isUpdatedAndPermissionIsWhiteEqual = useCallback(
    (oldPatch, userId) =>
      findUpdated(oldPatch, userId)?.isWhiteList === findPermission(oldPatch, userId)?.isWhiteList,
    [findPermission, findUpdated],
  );

  const isUpdatedAndPermissionEqual = useCallback(
    (oldPatch, userId) =>
      isUpdatedAndPermissionIsWhiteEqual(oldPatch, userId) && isUpdatedAndPermissionScopesEqual(oldPatch, userId),
    [isUpdatedAndPermissionIsWhiteEqual, isUpdatedAndPermissionScopesEqual],
  );

  const isDeleted = useCallback(
    (oldPatch, userId) =>
      oldPatch.deleted.map(permission => permission.user_id).includes(userId),
    [],
  );

  const handleSubmit = useCallback(async () => {
    const userId = (await getProfile()).id;

    //TODO. Мб можно сократить, если знать как преобразовать some->every или наоборот. a || (b && !c) || (!b && d)
    if (isDeleted(patch, userId)
      || (isWhiteListPermission(patch, userId) && ![scopes.API_PERMISSION_SET, scopes.API_PERMISSION_PERMISSIONS, scopes.PAGE_ADMINISTRATION]
        .every(scope => findUpdatedScopes(patch, userId)?.includes(scope)))
      || (!isWhiteListPermission(patch, userId) && [scopes.API_PERMISSION_SET, scopes.API_PERMISSION_PERMISSIONS, scopes.PAGE_ADMINISTRATION]
        .some(scope => findUpdatedScopes(patch, userId)?.includes(scope)))) {
      showWarning('Нельзя удалить самого себя или роли для управления данной вкладкой');
      return;
    }

    if (session && socket) {
      setIsPendingPermissions(true);
      socket.emit('permission:setPatch', session.access_token, patch, r => {
        if (r.status === 403) {
          showWarning(r?.data);
        } else {
          setPermissions(r?.permissions);
          updatePatch(oldPatch => ({
            ...oldPatch,
            created: [],
            deleted: [],
            updated: [],
          }));
          showSuccess(r?.data);
          setIsPendingPermissions(false);
        }
      });
    } else {
      showError('Нет связи с сервером');
    }
  }, [findUpdatedScopes, isDeleted, isWhiteListPermission, patch, scopes, session, showError, showSuccess, showWarning, socket, updatePatch]);

  const isCreated = useCallback(
    (oldPatch, userId) =>
      oldPatch.created.map(permission => permission.user_id).includes(userId),
    [],
  );

  const isScopeDeleted = useCallback(
    (oldPatch, userId, scope) =>
      subtractUpdatedFromPermissionScopes(oldPatch, userId).includes(scope),
    [subtractUpdatedFromPermissionScopes],
  );

  const isScopeCreated = useCallback(
    (oldPatch, userId, scope) =>
      subtractPermissionFromUpdatedScopes(oldPatch, userId).includes(scope),
    [subtractPermissionFromUpdatedScopes],
  );

  const isPatched = useCallback(
    (oldPatch) =>
      oldPatch.created.length <= 0 && oldPatch.updated.length <= 0 && oldPatch.deleted.length <= 0,
    [],
  );

  const handleDeleteScopes = useCallback((userId) => {
    updatePatch(oldPatch => ({
      ...oldPatch,
      updated: [
        ...subtractPermissionFromUpdated(oldPatch, userId),
        {
          ...findPermission(oldPatch, userId),
          scopes: [],
        },
      ],
    }));
  }, [updatePatch, findPermission, subtractPermissionFromUpdated]);

  const handleRestoreScopes = useCallback((userId) => {
    updatePatch(oldPatch => ({
      ...oldPatch,
      updated: subtractPermissionFromUpdated(oldPatch, userId),
    }));
  }, [updatePatch, subtractPermissionFromUpdated]);

  const handleDeleteScope = useCallback((userId, scope) => {
    updatePatch(oldPatch => {
      const filteredPatch = {
        ...oldPatch,
        updated: subtractPermissionFromUpdated(oldPatch, userId),
      };
      const newPatch = clonePatch(filteredPatch);

      newPatch.updated.push({
        ...findUpdatedOrPermission(oldPatch, userId),
        scopes: findUpdatedOrPermissionScopes(oldPatch, userId).filter(item => item !== scope),
      });

      if (!isUpdatedAndPermissionEqual(newPatch, userId)) {
        return newPatch;
      }
      return filteredPatch;
    });
  }, [updatePatch, subtractPermissionFromUpdated, clonePatch, findUpdatedOrPermission, findUpdatedOrPermissionScopes, isUpdatedAndPermissionEqual]);

  const handleRestoreScope = useCallback((userId, scope) => {
    updatePatch(oldPatch => {
      const filteredPatch = {
        ...oldPatch,
        updated: subtractPermissionFromUpdated(oldPatch, userId),
      };
      const newPatch = clonePatch(filteredPatch);

      newPatch.updated.push({
        ...findUpdatedOrPermission(oldPatch, userId),
        scopes: [
          ...findUpdatedScopes(oldPatch, userId),
          scope,
        ],
      });

      if (!isUpdatedAndPermissionEqual(newPatch, userId)) {
        return newPatch;
      }
      return filteredPatch;
    });
  }, [updatePatch, subtractPermissionFromUpdated, clonePatch, findUpdatedOrPermission, findUpdatedScopes, isUpdatedAndPermissionEqual]);

  const handleSelectUsers = useCallback((newUsers, scopes) => {
    updatePatch(oldPatch => {
      const filteredPatch = {
        ...oldPatch,
        created: oldPatch.created.filter(permission => !newUsers.includes(permission.user_id)),
        updated: oldPatch.updated.filter(permission => !newUsers.includes(permission.user_id)),
      };
      const newPatch = clonePatch(filteredPatch);

      newUsers.forEach(userId => {
        newPatch.created.push({
          user_id: userId,
          isWhiteList: true,
          scopes: [],
        });
        if (scopes.length > 0) {
          newPatch.updated.push({
            user_id: userId,
            isWhiteList: true,
            scopes,
          });
        }
      });
      return newPatch;
    });
  }, [clonePatch, updatePatch]);

  const handleSelectScopes = useCallback((userId, newScopes) => {
    updatePatch(oldPatch => {
      const filteredPatch = {
        ...oldPatch,
        updated: subtractPermissionFromUpdated(oldPatch, userId),
      };
      const newPatch = clonePatch(filteredPatch);

      newPatch.updated.push({
        ...findUpdatedOrPermission(oldPatch, userId),
        scopes: [
          ...findUpdatedOrPermissionScopes(oldPatch, userId),
          ...newScopes.filter(scope => !findUpdatedScopes(oldPatch, userId)?.includes(scope)),
        ],
      });

      if (!isUpdatedAndPermissionEqual(newPatch, userId)) {
        return newPatch;
      }
      return filteredPatch;
    });
  }, [
    updatePatch, subtractPermissionFromUpdated, clonePatch, findUpdatedOrPermission, findUpdatedOrPermissionScopes, isUpdatedAndPermissionEqual,
    findUpdatedScopes,
  ]);

  const handleDeleteUser = useCallback(userId => {
    updatePatch(oldPatch => {
      const newPatch = clonePatch(oldPatch);

      if (isCreated(oldPatch, userId)) {
        newPatch.created = oldPatch.created.filter(permission => permission.user_id !== userId);
      } else {
        newPatch.deleted = [
          ...newPatch.deleted,
          findPermission(oldPatch, userId),
        ];
        newPatch.updated = subtractPermissionFromUpdated(oldPatch, userId);
        newPatch.updated = [
          ...newPatch.updated,
          {
            ...findPermission(oldPatch, userId),
            scopes: [],
          },
        ];
      }
      return newPatch;
    });
  }, [updatePatch, clonePatch, isCreated, subtractPermissionFromUpdated, findPermission]);

  const handleRestoreUser = useCallback(userId => {
    updatePatch(oldPatch => ({
      ...oldPatch,
      deleted: oldPatch.deleted.filter(permission => permission.user_id !== userId),
      updated: subtractPermissionFromUpdated(oldPatch, userId),
    }));
  }, [subtractPermissionFromUpdated, updatePatch]);

  const handleCopyUser = useCallback((oldPatch, userId) => {
    setCopiedScopes(findUpdatedOrPermissionScopes(oldPatch, userId));
    setOpenSelectUsers(true);
  }, [findUpdatedOrPermissionScopes]);

  const handleChangeScopesMode = useCallback((oldPatch, userId, isWhiteList) => {
    updatePatch(oldPatch => {
      const filteredPatch = {
        ...oldPatch,
        updated: subtractPermissionFromUpdated(oldPatch, userId),
      };
      const newPatch = clonePatch(filteredPatch);

      newPatch.updated.push({
        ...findUpdatedOrPermission(oldPatch, userId),
        isWhiteList,
      });

      if (!isUpdatedAndPermissionEqual(newPatch, userId)) {
        return newPatch;
      }
      return filteredPatch;
    });
  }, [clonePatch, findUpdatedOrPermission, isUpdatedAndPermissionEqual, subtractPermissionFromUpdated, updatePatch]);

  const columns = useMemo(
    () => [
      {
        name: 'user_id',
        label: 'Пользователь',
        options: {
          customHeadLabelRender: ({label}) =>
            <div className={classes.userHeader}>
              <AddCircle
                variant="outlined"
                className={classes.addUser}
                onClick={e => {
                  e.stopPropagation();
                  setOpenSelectUsers(true);
                }}
              />
              {label}
            </div>,
          customBodyRender: userId =>
            <Typography color={isCreated(patch, userId)
              ? theme.palette.primary.success
              : isDeleted(patch, userId)
                ? theme.palette.primary.failure
                : null
            }>
              {`${users?.[userId]?.username ?? userId}`}
            </Typography>,
        },
      }, {
        name: 'scopes',
        label: 'Права доступа',
        options: {
          sort: false,
          customBodyRenderLite: dataIndex => {
            const userId = convertDataIndexToUserId(patch, dataIndex);

            return (
              <>
                {!isWhiteListPermission(patch, userId)
                  ? <Typography variant="body2" color="primary">
                    Все права доступны
                  </Typography>
                  : <></>}
                {findPermissionScopes(patch, userId)
                  .concat(subtractPermissionFromUpdatedScopes(patch, userId))
                  .map(scope =>
                    <Chip
                      key={`${scope}`}
                      variant="outlined"
                      color="primary"
                      label={`${scope}`}
                      disabled={isDeleted(patch, userId)}
                      className={classNames(
                        classes.scope,
                        {[classes.deletedScope]: isScopeDeleted(patch, userId, scope)},
                        {[classes.createdScope]: isScopeCreated(patch, userId, scope)},
                      )}
                      onDelete={() => isScopeDeleted(patch, userId, scope)
                        ? handleRestoreScope(userId, scope)
                        : handleDeleteScope(userId, scope)}
                      deleteIcon={isScopeDeleted(patch, userId, scope)
                        ? <RestoreFromTrash/>
                        : <Delete/>}
                    />,
                  )}
                <Chip
                  color="primary"
                  label={isWhiteListPermission(patch, userId)
                    ? 'Добавить'
                    : 'Добавить исключения'}
                  disabled={isDeleted(patch, userId)}
                  className={classes.addScope}
                  onClick={() => {
                    setUserIdOfScopeEditing(userId);
                    setOpenSelectScopes(true);
                  }}
                />
              </>
            );
          },
        },
      }, {
        name: '',
        label: '',
        options: {
          sort: false,
          filter: false,
          searchable: false,
          customHeadLabelRender: () =>
            <Tooltip title="Применить">
              <span>
                <IconButton
                  children={<Save/>}
                  color="primary"
                  disabled={isPatched(patch)}
                  onClick={async () => await handleSubmit()}
                />
              </span>
            </Tooltip>,
          customBodyRenderLite: dataIndex => {
            const userId = convertDataIndexToUserId(patch, dataIndex);

            return (
              <>
                <Tooltip title="Скопировать">
                  <span>
                    <IconButton
                      children={<ContentCopy/>}
                      color="primary"
                      disabled={isDeleted(patch, userId) || isLoading}
                      onClick={() => handleCopyUser(patch, userId)}
                    />
                  </span>
                </Tooltip>
                {isDeleted(patch, userId)
                  ? <Tooltip title="Восстановить">
                    <IconButton
                      children={<RestoreFromTrash/>}
                      color="primary"
                      onClick={() => handleRestoreUser(userId)}
                    />
                  </Tooltip>
                  : <Tooltip title="Удалить">
                    <IconButton
                      children={<Delete/>}
                      color="primary"
                      onClick={() => handleDeleteUser(userId)}
                    />
                  </Tooltip>}
                {findUpdated(patch, userId)
                  ? <Tooltip title="Восстановить все права доступа">
                    <span>
                      <IconButton
                        children={<SelectAll/>}
                        color="primary"
                        disabled={isDeleted(patch, userId) || (isCreated(patch, userId) && findUpdatedScopes(patch, userId).length <= 0)}
                        onClick={() => handleRestoreScopes(userId)}
                      />
                    </span>
                  </Tooltip>
                  : <Tooltip title="Удалить все права доступа">
                    <span>
                      <IconButton
                        children={<Deselect/>}
                        color="primary"
                        disabled={isDeleted(patch, userId) || findPermissionScopes(patch, userId).length <= 0}
                        onClick={() => handleDeleteScopes(userId)}
                      />
                    </span>
                  </Tooltip>}
                {isWhiteListPermission(patch, userId)
                  ? <Tooltip title="Белый список">
                    <IconButton
                      children={<ToggleOn/>}
                      color="primary"
                      onClick={() => handleChangeScopesMode(patch, userId, false)}
                    />
                  </Tooltip>
                  : <Tooltip title="Черный список">
                    <IconButton
                      children={<ToggleOff/>}
                      color="primary"
                      onClick={() => handleChangeScopesMode(patch, userId, true)}
                    />
                  </Tooltip>
                }
              </>
            );
          },
        },
      },
    ],
    [
      classes,
      convertDataIndexToUserId,
      findPermissionScopes,
      findUpdated,
      findUpdatedScopes,
      subtractPermissionFromUpdatedScopes,
      isLoading,
      isCreated,
      isDeleted,
      isPatched,
      isScopeCreated,
      isScopeDeleted,
      isWhiteListPermission,
      users,
      patch,
      setOpenSelectUsers,
      handleCopyUser,
      handleDeleteScope,
      handleDeleteUser,
      handleRestoreUser,
      handleRestoreScope,
      handleDeleteScopes,
      handleRestoreScopes,
      handleSubmit,
      handleChangeScopesMode,
    ],
  );

  const options = useMemo(() => ({
    ...defaultOptions,
    viewColumns: false,
    rowHover: false,
    sortOrder: {
      name: 'user_id',
      direction: 'desc',
    },
  }), []);

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (!permissions) {
    return <Typography color="primary" variant="body2">Данные недоступны</Typography>;
  }

  return (
    <>
      <MUIDataTable
        columns={columns}
        data={concatCreatedToPermissions(patch)}
        options={options}
      />
      <SelectUsers
        open={openSelectUsers}
        setOpen={setOpenSelectUsers}
        users={users}
        onSubmit={handleSelectUsers}
        defaultCheckedUserIds={concatCreatedToPermissions(patch).map(permission => permission.user_id)}
        scopes={copiedScopes}
      />
      <SelectScopes
        open={openSelectScopes}
        setOpen={setOpenSelectScopes}
        scopes={Object.values(scopes)}
        onSubmit={handleSelectScopes}
        userId={userIdOfScopeEditing}
        getDefaultScopes={findUpdatedOrPermissionScopes}
        isWhiteListPermission={isWhiteListPermission}
        patch={patch}
      />
    </>
  );
});

Access.displayName = 'Access';
