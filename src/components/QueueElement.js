import {Avatar, Divider, Stack, Typography} from "@mui/material";
import {timeFormatmSeconds} from "../utils/dateTime";
import {motion} from "framer-motion";
import {LoadingButton} from "@mui/lab";
import {Delete} from "@mui/icons-material";

const QueueElement = ({index, length, element, loading = false, onRemove}) => {
  return (
    <Stack
      component={motion.div}
      initial={false}
      whileHover={{scale: 1.02}}
      animate={element?.isRemoved ? "removed" : element?.isAdded ? "added" : "usual"}
      variants={{
        usual: {background: "#ff000800"},
        removed: {background: "#ff00083f"},
        added: {background: "#3a900F3f"}
      }}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      padding={1}
      spacing={1}
      sx={{
        width: "100%",
        borderRadius: "24px",
        ":hover": {
          cursor: "move"
        }
      }}
    >
      <Typography>{`${index + 1}`.padStart(`${length}`.length, '0')}</Typography>
      <Divider orientation="vertical" flexItem/>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{
          width: "100%"
        }}
      >
        <Stack
          direction="column"
          alignItems="flex-start"
          spacing={0.1}
          sx={{
            width: "100%"
          }}
        >
          <Typography>{element.title}</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{
              width: "100%"
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              alignSelf="flex-start"
              spacing={1}
            >
              <Avatar src={element.author.avatarURL} sx={{width: 24, height: 24}}/>
              <Typography>{element.author.username}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Typography>{timeFormatmSeconds(parseInt(element.length) * 1000)}</Typography>
      </Stack>
      <LoadingButton
        loading={loading}
        variant="contained"
        color="primary"
        value="remove"
        size="small"
        aria-label="удалить"
        onClick={() => onRemove(index)}
        sx={{padding: "3px", minWidth: "32px"}}
      >
        <Delete/>
      </LoadingButton>
    </Stack>
  );
};
export default QueueElement;