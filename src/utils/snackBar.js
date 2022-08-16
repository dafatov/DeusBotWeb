import {Collapse} from '@mui/material';
import {useSnackbar as useSnackBarNotistack} from 'notistack';
import {useMemo} from 'react';

export const SnackBarProviderProps = {
  autoHideDuration: 3000,
  preventDuplicate: true,
  maxSnack: 3,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  TransitionComponent: Collapse,
}

export const useSnackBar = () => {
  const {enqueueSnackbar} = useSnackBarNotistack();

  const showSuccess = useMemo(() => (message, options = {}) =>
    enqueueSnackbar(message, {...options, variant: "success"}), [enqueueSnackbar]);
  const showWarning = useMemo(() => (message, options = {}) =>
    enqueueSnackbar(message, {...options, variant: "warning"}), [enqueueSnackbar]);
  const showInfo = useMemo(() => (message, options = {}) =>
    enqueueSnackbar(message, {...options, variant: "info"}), [enqueueSnackbar]);
  const showError = useMemo(() => (message, options = {}) =>
    enqueueSnackbar(message, {...options, variant: "error"}), [enqueueSnackbar]);

  return {
    showSuccess,
    showWarning,
    showInfo,
    showError,
  };
};
