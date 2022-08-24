import {CircularProgress, Typography} from '@mui/material';
import moment from 'moment-timezone';
import MUIDataTable from 'mui-datatables';
import {memo, useEffect, useMemo, useState} from 'react';
import {defaultOptions} from '../../configs/muiDataTable';
import {useAuth} from '../../security/AuthProvider';
import {useSocket} from '../../security/SocketProvider';
import {useSnackBar} from '../../utils/snackBar';
import {useInterval} from '../../utils/useInterval';

export const Audit = memo(() => {
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
      label: 'Дата/время',
      options: {
        filter: false,
        searchable: false,
        customBodyRender: (value) => moment.utc(value).local().toDate().toLocaleString('ru-RU', {
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
      label: 'Сервер',
      options: {
        customBodyRender: (value) => guilds?.[value]?.name ?? '-',
      },
    }, {
      name: 'type',
      label: 'Тип',
    }, {
      name: 'category',
      label: 'Категория',
    }, {
      name: 'message',
      label: 'Сообщение',
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
    return <Typography color="primary" variant="body2">Данные недоступны</Typography>;
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
