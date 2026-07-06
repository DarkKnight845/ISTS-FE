import { Box, Typography, Button, TextField, Icon} from "@mui/material";
import StatCard from "@/components/ui/Cards/StatCard";
import DashboardHeader from "@/components/ui/DahboardHeader";
import StaffToolbar from "@/components/ui/Toolbar";
import RaiseTicketModal from "@/components/ui/Modals/RaiseTicketModals";
import StaffNavbar from "@/components/ui/Nabvar/StaffNavbar";
import StaffTable from "@/components/ui/Tables/StaffTable";
import ticketImage from "@/assets/icons/ion_ticket_stat.svg"
import ticketOrange from "@/assets/icons/ion_ticket_orange.svg"
import ticketGreen from "@/assets/icons/ion_ticket_green.svg"
import ticketRed from "@/assets/icons/ion_ticket_red.svg"
import { useState } from "react";
import type { Ticket } from "@/components/ui/types/ticket";



function StaffDashboardPage() {

    const [openModal, setOpenModal] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const handleCreateTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);};

    return(
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#F8F9FB", 
                px:5               

            }}
        
        
        >  {/* Navbar */}
            <StaffNavbar />

           {/* Header */}
            <DashboardHeader />

           {/* cards */}
            <Box sx={{mb:4,
                height:160,
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
                p:3,
                bgcolor:"white",
                borderRadius:3,
                border: "1px solid #EAECF0",
            }}>
                <StaffToolbar
                onRaiseTicket={() => setOpenModal(true)}
                />
            </Box>

           {/* Table */}
            <Box sx={{mt:4
            }}>
            
            <StaffTable tickets={tickets} />
            </Box>


            <RaiseTicketModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSubmit={handleCreateTicket}
            />

        </Box>
    );
}

export default StaffDashboardPage;