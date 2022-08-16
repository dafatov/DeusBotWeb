import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    borderRadius: '24px',
    '&:hover': {
      cursor: 'move',
    },
  },
  fullWidth: {
    width: '100%',
  },
  avatar: {
    width: '24px',
    height: '24px',
  },
  loadingButton: {
    padding: '3px',
    minWidth: '32px',
  },
}));
