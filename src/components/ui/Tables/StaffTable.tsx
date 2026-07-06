import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import type{Ticket} from "@/components/ui/types/ticket";


type StaffTableProps = {
  tickets: Ticket[];
};


function StaffTable({ tickets }: StaffTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid #EAECF0",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Table>

        <TableHead>

          <TableRow
            sx={{
              backgroundColor: "#F9FAFB",
            }}
          >
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              TICKET ID
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              SUBJECT
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                CATEGORY
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </Box>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                STATUS
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </Box>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                TIME UPDATED
                <ImportExportIcon sx={{ fontSize: 15 }} />
              </Box>
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: "#667085",
                fontSize: 13,
              }}
            >
              ACTIONS
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {tickets.map((ticket) => (

            <TableRow
              key={ticket.id}
              hover
              sx={{
                "&:last-child td": {
                  borderBottom: "none",
                },
              }}
            >

              <TableCell>
                <Typography
                  sx={{
                    color: "#2859B8",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {ticket.subject}
                </Typography>
              </TableCell>

              <TableCell>

                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {ticket.department}
                </Typography>

              </TableCell>

              <TableCell>

                <Typography
                  sx={{
                    fontStyle: "italic",
                    color: "#344054",
                  }}
                >
                  {ticket.category}
                </Typography>

              </TableCell>

              <TableCell>

                <Chip
                  label={ticket.status}
                  sx={{
                    backgroundColor: "#D7EBFF",
                    color: "#1565C0",
                    border: "1px solid #1565C0",
                    borderRadius: "20px",
                    fontWeight: 500,
                  }}
                />

              </TableCell>

              <TableCell>

                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {ticket.createdAt}
                </Typography>

              </TableCell>

              <TableCell align="center">

                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default StaffTable;