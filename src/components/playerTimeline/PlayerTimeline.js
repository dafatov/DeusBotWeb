import {Avatar, LinearProgress, Stack, styled, Typography} from '@mui/material';
import {memo} from 'react';
import {timeFormatMilliseconds} from '../../utils/dateTime';
import {useStyles} from './playerTimelineStyles';

export const PlayerTimeline = memo(({playbackDuration, totalDuration, authorLink, authorName, isLive = false}) => {
  const classes = useStyles();

  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
  }));

  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={0.25}
      className={classes.fullWidth}
    >
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        spacing={1}
        className={classes.fullWidth}
      >
        <Stack
          direction="row"
          alignItems="center"
          alignSelf="flex-start"
          spacing={1}
        >
          <Avatar src={authorLink} className={classes.avatar}/>
          <Typography>{authorName}</Typography>
        </Stack>
        {isLive
          ? <></>
          : <Stack
            direction="row"
            alignSelf="flex-end"
            spacing={1}
          >
            <Typography>{timeFormatMilliseconds(playbackDuration)}</Typography>
            <Typography>/</Typography>
            <Typography>{timeFormatMilliseconds(totalDuration)}</Typography>

          </Stack>
        }
      </Stack>
      <BorderLinearProgress
        variant="determinate"
        value={isLive
          ? 100
          : (100 * playbackDuration / totalDuration)}
        className={classes.fullWidth}
      />
    </Stack>
  );
});

PlayerTimeline.displayName = 'PlayerTimeline';
