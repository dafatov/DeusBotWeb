import {Card, CardContent, Typography} from "@mui/material";
import {useAuth} from "../../security/AuthProvider";
import {useSocket} from "../../security/SocketProvider";
import ReactDragListView from "react-drag-listview";
import QueueElement from "../../components/QueueElement";
import {motion} from "framer-motion";
import Scrollbar from "react-scrollbars-custom";
import {useSnackBar} from "../../utils/SnackBar";

//TODO отключать перемещение элементов при загрузке
//TODO отключать таймер при потери связи с сервером (а лучше вообще это как-то обрабатывать)
//TODO добавить локальное предсказание ответа сервера (просто делать то что и сервер до его ответа)
const QueueView = ({songs, isLoading, setIsLoading}) => {
  const {showSuccess, showWarning} = useSnackBar();
  const [, session] = useAuth();
  const socket = useSocket();

  const handleRemove = index => {
    setIsLoading(true);
    socket.emit("queue:remove", session.access_token, index, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Успешно удалена композиция: "${data.isRemoved.title}"`)
      }
    });
  }

  const handleDragEnd = (from, to) => {
    setIsLoading(true);
    socket.emit("queue:move", session.access_token, from, to, data => {
      if (data.result) {
        showWarning(data.result);
      } else {
        showSuccess(`Успешно перемещана на "${data.newIndex + 1}" позицию композиция: "${data.isMoved.title}"`)
      }
    });
    /*const data = [...songs];
    const item = data.splice(from, 1)[0];
    data.splice(to, 0, item);
    setSongs(data);*/
  }

  return (
    <Card>
      <CardContent>
        {songs
          ?
          <Scrollbar
            noScrollX
            style={{
              width: "100%",
              height: "80vh"
            }}>
            <ReactDragListView
              onDragEnd={handleDragEnd}
              nodeSelector="li"
              handleSelector="li"
            >
              {songs.map((song, index) => (
                <li style={{listStyleType: "none", display: "flex"}} key={index}>
                  <QueueElement key={song.id} index={index} length={songs.length} element={song} loading={isLoading} onRemove={handleRemove}/>
                </li>
              ))}
            </ReactDragListView>
          </Scrollbar>
          :
          <motion.div
            animate={{backgroundColor: ["#FFFF50ff", "#FFFF5000", "#FFFF50ff"]}}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
            style={{
              height: "48px",
              borderRadius: "13px"
            }}
          >
            <Typography
              color="primary"
              variant="h4"
              display="flex"
              justifyContent="center"
              alignContent="center"
            >Идет загрузка...</Typography>
          </motion.div>
        }
      </CardContent>
    </Card>
  );
};

export default QueueView;