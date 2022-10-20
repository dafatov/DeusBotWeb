import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  inputRoot: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  clear: {
    padding: theme.spacing(1.5),
  },
}));
