import {ExpandMore} from '@mui/icons-material';
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material';
import {memo} from 'react';
import {Access} from '../../components/access/Access';
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
      <Accordion color="primary">
        <AccordionSummary
          expandIcon={<ExpandMore/>}
          aria-controls="panel1a-content"
        >
          <Typography color="primary">Доступ</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Access/>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

Administration.displayName = 'Administration';
