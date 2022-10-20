import {alpha} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  scope: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(),
  },
  deletedScope: {
    color: theme.palette.primary.failure,
  },
  createdScope: {
    color: theme.palette.primary.success,
  },
  addScope: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  userHeader: {
    display: 'flex',
  },
  addUser: {
    marginRight: theme.spacing(0.5),
    color: alpha(theme.palette.primary.main, 0.7),
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));
