import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const BuildTools = () => {
  const theme = useTheme();

  return (
    <Box marginBottom={4}>
      <Box marginBottom={4}>
        <Box marginBottom={2}>
          <Typography
            variant="h4"
            color="text.primary"
            align={"center"}
            gutterBottom
            sx={{
              fontWeight: 700,
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
            align={"center"}
          >
            "Explore our FAQ section: Get answers to commonly asked questions"
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box
          sx={{ width: { xs: "100%", md: "60%" } }}
          width={50}
          component={SyntaxHighlighter}
          language={"javascript"}
          style={vs2015}
          padding={`${theme.spacing(2)} !important`}
          borderRadius={2}
          margin={`${theme.spacing(0)} !important`}
          bgcolor={"#21325b !important"}
        >
          {/* > $ 
// 
> $  */}
          {`
          // How to Apply For Internships?

 > $ To Apply For Upcoming Batch Of Internship You Need To Fill The Interest Form In That Specific Domain,
     After That You Will Directly Receive The Selection Certificate From Us If Selected.
 
         // How to Apply For Internships?

 > $ You Will Get The Interest Form Of All The Internships Domain In Above Mentioned Internship Column. 
     Please Click On Apply Now Button, Your Response Will Help Us To Understand Your Current Skills And
     Need For Training During The Internship If Any.

        // What Will Be The Duration Of Internship?

 > $ In Every Domain Duration Of Internship Is 4 Weeks.
 
       // What is the location of intenship?
 
 > $ Internship and training will be virtually.

      // When we will get certificate, LOR and Swags?

 > $ You will recieve your internship completion certificate and LOR upto the next month 5 working days
     and swags will take 10 or more working days to get deliver.

        `}
        </Box>
      </Box>
    </Box>
  );
};

export default BuildTools;
