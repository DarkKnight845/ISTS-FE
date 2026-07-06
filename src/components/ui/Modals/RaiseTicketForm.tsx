import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import {useState} from "react";

import {type Ticket} from "@/components/ui/types/ticket";


type RaiseTicketFormProps = {
    onSubmit: (ticket: Ticket) => void;
};

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";



function RaiseTicketForm({ onSubmit }: RaiseTicketFormProps) {

  
const [subject, setSubject] = useState("");

const [department, setDepartment] = useState("");

const [category, setCategory] = useState("");

const [description, setDescription] = useState("");

const [priority, setPriority] = useState<
    "Low" | "Medium" | "High" | "Urgent"
>("Low");

  const inputStyle = {
    bgcolor: "#F9FAFB",
    fontFamily: "General sans",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D0D5DD",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#98A2B3",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2859B8",
    },

    borderRadius: 2,

    height: 56,
  };

  return (
    <Box>

      {/* SUBJECT */}

     <Box sx={{border: "1px solid #EAECF0",
         borderRadius: 3, 
         p: 3,
         mb:4,
         }}>

        <Box sx={{mb:3}}>
        <Typography
          sx={{
            mb: 1,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          Ticket Subject
        </Typography>

        <TextField
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          placeholder="Summarize your issue in one sentence"
          sx={{
            "& .MuiOutlinedInput-root": inputStyle,

            "& input::placeholder": {
              color: "#98A2B3",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* DEPARTMENT + CATEGORY */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{flex:1}}>
          <Typography
            sx={{
              mb: 1,
              fontWeight: 500,
              fontFamily: "General sans",
            }}
          >
            Department
          </Typography>

          <FormControl fullWidth>
            <Select
              displayEmpty
              defaultValue=""
              sx={inputStyle}
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>

              <MenuItem value="IT">
                IT
              </MenuItem>

              <MenuItem value="HR">
                HR
              </MenuItem>

              <MenuItem value="Finance">
                Finance
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{flex:1}}>
          <Typography
            sx={{
              mb: 1,
              fontWeight: 500,
              fontFamily: "General sans",
            }}
          >
            Category
          </Typography>

          <FormControl fullWidth>
            <Select
              displayEmpty
              defaultValue=""
              sx={inputStyle}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>

              <MenuItem value="Hardware">
                Hardware
              </MenuItem>

              <MenuItem value="Software">
                Software
              </MenuItem>

              <MenuItem value="Network">
                Network
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* DESCRIPTION */}

      <Box sx={{mb:1}}>
        <Typography
          sx={{
            mb: 1,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          Describe your issue
        </Typography>

        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder="What happened? When did it start? What have you already tried?"
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#F9FAFB",

              borderRadius: 2,

              "& fieldset": {
                borderColor: "#D0D5DD",
              },

              "&:hover fieldset": {
                borderColor: "#98A2B3",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#2859B8",
              },
            },

            "& textarea::placeholder": {
              color: "#98A2B3",
              opacity: 1,
            },
          }}
        />
      </Box>
     </Box>

      {/* PRIORITY */}

      <Box sx={{mb:4}}>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          How urgent is this issue?
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 2,
            fontFamily: "General sans",
          }}
        >
          {[
            {
              title: "Low",
              color: "#16A34A",
              text: "General inquiry, no impact to your work",
            },
            {
              title: "Medium",
              color: "#EAB308",
              text: "Affecting productivity, workaround available",
            },
            {
              title: "High",
              color: "#F59E0B",
              text: "Significantly impacting your work, no workaround",
            },
            {
              title: "Urgent",
              color: "#DC2626",
              text: "Complete work stoppage or security risk",
            },
          ].map((item) => (
            <Box
              key={item.title}
              sx={{
                border: "1px solid #D0D5DD",

                borderRadius: 2,

                p: 3,

                cursor: "pointer",

                transition: ".2s",

                "&:hover": {
                  borderColor: "#2859B8",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: 1,

                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,

                    height: 10,

                    borderRadius: "50%",

                    bgcolor: item.color,
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 500,
                    fontFamily: "General sans",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#667085",

                  fontSize: 13,
                  fontFamily: "General sans",
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ATTACHMENT */}

      <Box>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 500,
            fontFamily: "General sans",
          }}
        >
          Attach Supporting Files
        </Typography>

        <Box
          sx={{
            border: "2px dashed #D0D5DD",

            borderRadius: 3,

            py: 6,

            textAlign: "center",

            bgcolor: "#F9FAFB",

            cursor: "pointer",

            transition: ".2s",

            "&:hover": {
              borderColor: "#2859B8",

              bgcolor: "#F5F9FF",
            },
          }}
        >
          <CloudUploadOutlinedIcon
            sx={{
              fontSize: 42,

              color: "#667085",
            }}
          />

          <Typography
            sx={{
              mt: 2,

              fontWeight: 600,
            }}
          >
            Upload files
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "#667085",

              fontSize: 14,
            }}
          >
            Drag & drop or click to browse
          </Typography>

          <Typography
            sx={{
              mt: .5,

              color: "#98A2B3",

              fontSize: 13,
            }}
          >
            JPG, PNG, PDF • Max 10MB
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

export default RaiseTicketForm;