import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  preview: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  defaultPreview: {
    width: '100%',
    aspectRatio: 1.75,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: theme.spacing(0.75),
    minWidth: '48px',
    minHeight: '24px',
  },
  defaultTimeline: {
    width: '100%',
    height: '40px',
  },
  loadingButton: {
    padding: theme.spacing(1.875),
    minWidth: '56px',
  },
}));
