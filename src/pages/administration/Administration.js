import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@mui/material";
import Audit from "./Audit";
import {ExpandMore} from "@mui/icons-material";

const Administration = () => {
  return (
    <Box sx={{width: "100%", marginTop: "8px"}}>
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
};

export default Administration;