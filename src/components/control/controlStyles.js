import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  blockRoot: {
    padding: theme.spacing(1),
    width: '100%',
  },
  blockContainer: {
    marginTop: theme.spacing(1.5),
  },
  loadingButton: {
    padding: theme.spacing(1.875),
    minWidth: '56px',
  },
}));
