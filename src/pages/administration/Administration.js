import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material';
import {Access} from '../../components/access/Access';
import {Audit} from '../../components/audit/Audit';
import {ExpandMore} from '@mui/icons-material';
import {memo} from 'react';
import {useStyles} from './administrationStyles';
import {useTranslation} from 'react-i18next';

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
