import {useEffect, useState} from "react";
import {useAuth} from "../../security/AuthProvider";
import {useSocket} from "../../security/SocketProvider";
import {useInterval} from "../../utils/UseInterval";
import {CircularProgress} from "@mui/material";
import MUIDataTable from "mui-datatables";
import moment from "moment-timezone";

const Audit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingAudit, setIsPendingAudit] = useState(false);
  const [isPendingGuilds, setIsPendingGuilds] = useState(false);
  const [, session] = useAuth();
  const socket = useSocket();
  const [audit, setAudit] = useState(null);
  const [guilds, setGuilds] = useState(null);

  useEffect(() => {
    setIsLoading(isPendingGuilds || isPendingAudit);
  }, [isPendingAudit, isPendingGuilds])

  useEffect(() => {
    if (session && socket) {
      socket.on("auditor:audit", r => {
        setAudit(r);
        setIsPendingAudit(false);
      });
    } else {
      setAudit(null);
    }
    return () => {
      socket?.removeAllListeners("auditor:audit");
    }
  }, [session, socket])

  useEffect(() => {
    if (socket) {
      socket.emit("auditor:getGuilds", data => {
        setGuilds(
          ...JSON.parse(data.guilds)
            .map(guild => ({[guild.id]: guild}))
        );
        setIsPendingGuilds(false);
      })
    }
    return () => setGuilds(null);
  }, [setIsLoading, socket])

  useInterval(() => {
    if (session && socket) {
      socket.emit("auditor:audit");
    }
  }, 10000, [session, socket])

  if (isLoading || !audit) {
    return <CircularProgress/>
  }

  const columns = [{
    name: "created_at",
    label: "Дата/время",
    options: {
      filter: false,
      searchable: false,
      customBodyRender: (value) => moment.utc(value).local().toDate().toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3
      }),
    }
  }, {
    name: "guildId",
    label: "Сервер",
    options: {
      customBodyRender: (value) => guilds?.[value]?.name ?? "-",
    }
  }, {
    name: "type",
    label: "Тип",
  }, {
    name: "category",
    label: "Категория",
  }, {
    name: "message",
    label: "Сообщение",
    options: {
      filter: false,
      sort: false,
    }
  }];

  const options = {
    download: false,
    fixedHeader: false,
    print: false,
    rowsPerPageOptions: [10, 25, 100],
    sortOrder: {name: 'created_at', direction: "desc"},
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: "Извините, записи не найдены",
        toolTip: "Сортировка",
        columnHeaderTooltip: column => `Сортировка по ${column.label}`
      },
      pagination: {
        next: "Следующая страница",
        previous: "Предыдущая страница",
        rowsPerPage: "Строк на странице:",
        displayRows: "из",
      },
      toolbar: {
        search: "Поиск",
        downloadCsv: "Скачать CSV",
        print: "Печать",
        viewColumns: "Показывать столбцы",
        filterTable: "Фильтр",
      },
      filter: {
        all: "Все",
        title: "Фильтры",
        reset: "Сбросить",
      },
      viewColumns: {
        title: "Показывать столбцы",
        titleAria: "Скрыть/показать столбцы таблицы",
      },
      selectedRows: {
        text: "строк(-а,-и) выбрано",
        delete: "Удалить",
        deleteAria: "Удалить выбранные строки",
      },
    }
  };

  return (
    <MUIDataTable
      columns={columns}
      data={audit}
      options={options}
    />
  );
};

export default Audit;