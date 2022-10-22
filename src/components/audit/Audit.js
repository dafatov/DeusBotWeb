import {CircularProgress, Typography} from '@mui/material';
import {memo, useEffect, useMemo, useState} from 'react';
import MUIDataTable from 'mui-datatables';
import {defaultOptions} from '../../configs/muiDataTable';
import moment from 'moment-timezone';
import {useAuth} from '../../security/AuthProvider';
import {useInterval} from '../../utils/useInterval';
import {useSnackBar} from '../../utils/snackBar';
import {useSocket} from '../../security/SocketProvider';
import {useTranslation} from 'react-i18next';

export const Audit = memo(() => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingAudit, setIsPendingAudit] = useState(false);
  const [isPendingGuilds, setIsPendingGuilds] = useState(false);
  const [delay, setDelay] = useState(10000);
  const [logged, session] = useAuth();
  const socket = useSocket();
  const {showWarning} = useSnackBar();
  const [audit, setAudit] = useState(null);
  const [guilds, setGuilds] = useState(null);

  useEffect(() => {
    setIsLoading(isPendingGuilds || isPendingAudit);
  }, [isPendingAudit, isPendingGuilds]);

  useEffect(() => {
    if (logged && socket) {
      socket.on('auditor:audit', r => {
        if (r.status === 403) {
          showWarning(r?.data);
          socket?.removeAllListeners('auditor:audit');
          setDelay(null);
        } else {
          setAudit(r?.data);
        }
        setIsPendingAudit(false);
      });
    } else {
      setAudit(null);
    }
    return () => {
      socket?.removeAllListeners('auditor:audit');
    };
  }, [logged, showWarning, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('auditor:getGuilds', data => {
        setGuilds(
          ...JSON.parse(data.guilds)
            .map(guild => ({[guild.id]: guild})),
        );
        setIsPendingGuilds(false);
      });
    }
    return () => setGuilds(null);
  }, [socket]);

  useInterval(() => {
    if (logged && socket) {
      socket.emit('auditor:audit', session.access_token);
    }
  }, delay, [logged, socket]);

  const columns = useMemo(() => [
    {
      name: 'created_at',
      label: t('web:app.audit.table.createdAt.title', 'Дата/время'),
      options: {
        filter: false,
        searchable: false,
        customBodyRender: value => moment.utc(value).local().toDate().toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3,
        }),
      },
    }, {
      name: 'guildId',
      label: t('web:app.audit.table.guild.title', 'Сервер'),
      options: {
        customBodyRender: value => guilds?.[value]?.name ?? '-',
      },
    }, {
      name: 'type',
      label: t('web:app.audit.table.type.title', 'Тип'),
    }, {
      name: 'category',
      label: t('web:app.audit.table.category.title', 'Категория'),
    }, {
      name: 'message',
      label: t('web:app.audit.table.message.title', 'Сообщение'),
      options: {
        filter: false,
        sort: false,
      },
    },
  ], [guilds]);

  const options = useMemo(() => ({
    ...defaultOptions,
    sortOrder: {
      name: 'created_at',
      direction: 'desc',
    },
    jumpToPage: true,
  }), []);

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (!audit) {
    return <Typography color="primary" variant="body2">{t('common:app.dataNotAvailable', 'Данные недоступны')}</Typography>;
  }

  return (
    <MUIDataTable
      columns={columns}
      data={audit}
      options={options}
    />
  );
});

Audit.displayName = 'Audit';
