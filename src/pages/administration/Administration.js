import {ExpandMore} from '@mui/icons-material';
import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material';
import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Access} from '../../components/access/Access';
import {Audit} from '../../components/audit/Audit';
import {useStyles} from './administrationStyles';

export const Administration = memo(() => {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <Box className={classes.root}>
      <Accordion color="primary">
        <AccordionSummary
          expandIcon={<ExpandMore/>}
          aria-controls="panel1a-content"
        >
          <Typography color="primary">{t('web:app.administration.audit', 'Аудит')}</Typography>
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
          <Typography color="primary">{t('web:app.administration.access', 'Доступ')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Access/>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

Administration.displayName = 'Administration';
