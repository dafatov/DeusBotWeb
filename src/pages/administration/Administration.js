import {ExpandMore} from '@mui/icons-material';
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material';
import {memo} from 'react';
import {Audit} from '../../components/audit/Audit';
import {useStyles} from './administrationStyles';

export const Administration = memo(() => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Accordion color="primary">
        <AccordionSummary
          expandIcon={<ExpandMore/>}
          aria-controls="panel1a-content"
        >
          <Typography color="primary">Аудит</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Audit/>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

Administration.displayName = 'Administration';
