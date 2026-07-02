import { Box, Typography, Button, TextField, Icon} from "@mui/material";
import StatCard from "@/components/ui/Cards/StatCard";
import ticketImage from "@/assets/icons/ion_ticket_stat.svg"
import ticketOrange from "@/assets/icons/ion_ticket_orange.svg"
import ticketGreen from "@/assets/icons/ion_ticket_green.svg"
import ticketRed from "@/assets/icons/ion_ticket_red.svg"

function StaffDashboardPage() {
    return(
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F8F9FB",
                p: 4

            }}
        
        
        >  {/* Navbar */}
            <Box sx={{mb:4,
                display: "flex",
                height:80,
                bgcolor:"white",
                borderRadius:2
            }}
                
            >
                
            </Box>

           {/* Header */}
            <Box sx={{mb:4,
                height:60,
                bgcolor:"white",
                borderRadius:2,
                display:"flex",
                
                justifyContent:"space-between",
                alignContent:"center",
            }}

            >   {/* left-content */}
                <Box>
                    <Typography variant="h4">Staff Dashboard</Typography>
                    <Typography >Manage all your tickets</Typography>

                </Box>

                {/* right-content */}
                <Box>
                    <Button variant="outlined">This Month</Button>
                </Box>

            </Box>

           {/* cards */}
            <Box sx={{mb:4,
                height:160,
                bgcolor:"white",
                borderRadius:2,
                display:"flex",
                gap:3,
                mt:4,
            }}>
                <StatCard
                    title="Submitted "
                    value="12"
                    caption="Ticket have been raised"
                    icon={
                        <Box
                            component="img"
                            src={ticketImage}
                            alt="Ticket"
                            sx={{
                            width: 25,
                            height: 25,
                            backgroundColor:"#2559AA",
                            borderRadius:2,
                            p:1.3,
                            }}
                        />
                        }
                />

                <StatCard
                    title="In Progress"
                    value="3"
                    caption="Ticket are being worked on"
                    icon={
                        <Box
                            component="img"
                            src={ticketOrange}
                            alt="Ticket"
                            sx={{
                            width: 25,
                            height: 25,
                            backgroundColor:"#FFE2C2",
                            borderRadius:2,
                            p:1.3,
                            }}
                        />
                        }
                />

                <StatCard
                    title="Waiting on you"
                    value="2"
                    caption="Ticket require your action"
                    icon={
                        <Box
                            component="img"
                            src={ticketRed}
                            alt="Ticket"
                            sx={{
                            width: 25,
                            height: 25,
                            backgroundColor:"#FFC2C2",
                            borderRadius:2,
                            p:1.3,
                            }}
                        />
                        }
                />

                <StatCard
                    title="Resolved"
                    value="12"
                    caption="Ticket have been resolved"
                    icon={
                        <Box
                            component="img"
                            src={ticketGreen}
                            alt="Ticket"
                            sx={{
                            width: 25,
                            height: 25,
                            backgroundColor:"#C1E1CE",
                            borderRadius:2,
                            p:1.3,
                            }}
                        />
                        }
                />
                
            </Box>

           {/* toolbar */}
            <Box sx={{mb:4,
                height:70,
                bgcolor:"white",
                borderRadius:2
            }}>
            
            </Box>

           {/* Table */}
            <Box sx={{mb:4,
                height:450,
                bgcolor:"white",
                borderRadius:2
            }}>
            
            </Box>
        </Box>
    );
}

export default StaffDashboardPage;