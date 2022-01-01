import {Avatar, Stack, Typography} from "@mui/material";
import BorderLinearProgress from "./BorderLinearProgress";
import {timeFormatmSeconds} from "../utils/dateTime";

const PlayerTimeline = ({playbackDuration, totalDuration, authorLink, authorName, isLive = false}) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={0.25}
      sx={{
        width: "100%"
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-end"
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
          <Avatar src={authorLink} sx={{width: 24, height: 24}}/>
          <Typography>{authorName}</Typography>
        </Stack>
        {isLive
          ?
          <></>
          :
          <Stack
            direction="row"
            alignSelf="flex-end"
            spacing={1}
          >
            <Typography>{timeFormatmSeconds(playbackDuration)}</Typography>
            <Typography>/</Typography>
            <Typography>{timeFormatmSeconds(totalDuration)}</Typography>

          </Stack>
        }
      </Stack>
      <BorderLinearProgress
        variant="determinate"
        value={isLive ? 100 : (100 * playbackDuration / totalDuration)}
        sx={{
          width: "100%"
        }}
      />
    </Stack>
  );
};

export default PlayerTimeline;