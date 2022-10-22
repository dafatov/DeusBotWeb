import {Avatar, Divider, Stack, Typography} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import {memo} from 'react';
import {motion} from 'framer-motion';
import {timeFormatMilliseconds} from '../../../utils/dateTime';
import {useStyles} from './queueElementStyles';
import {useTranslation} from 'react-i18next';

export const QueueElement = memo(({index, length, element, loading = false, onRemove}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <Stack
      component={motion.div}
      initial={false}
      whileHover={{scale: 1.02}}
      animate={element?.isRemoved
        ? 'removed'
        : element?.isAdded
          ? 'added'
          : 'usual'}
      variants={{
        usual: {background: '#ff000800'},
        removed: {background: '#ff00083f'},
        added: {background: '#3a900F3f'},
      }}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      padding={1}
      spacing={1}
      className={classes.root}
    >
      <Typography>{`${index + 1}`.padStart(`${length}`.length, '0')}</Typography>
      <Divider orientation="vertical" flexItem/>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        className={classes.fullWidth}
      >
        <Stack
          direction="column"
          alignItems="flex-start"
          spacing={0.1}
          className={classes.fullWidth}
        >
          <Typography>{element.title}</Typography>
          <Stack
            direction="row"
            alignItems="center"
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
              <Avatar src={element.author.avatarURL} className={classes.avatar}/>
              <Typography>{element.author.username}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Typography>{timeFormatMilliseconds(parseInt(element.length) * 1000)}</Typography>
      </Stack>
      <LoadingButton
        loading={loading}
        variant="contained"
        color="primary"
        value="remove"
        size="small"
        aria-label={t('common:app.remove', 'Удалить')}
        onClick={() => onRemove(index)}
        className={classes.loadingButton}
      >
        <Delete/>
      </LoadingButton>
    </Stack>
  );
});

QueueElement.displayName = 'QueueElement';
