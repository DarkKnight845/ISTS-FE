import { Card, Box, Typography } from "@mui/material";

type StatCardProps = {
    title: string;
    value: string | number;
    caption: string;
    icon: React.ReactNode
}

function StatCard({
    title,
    value,
    caption,
    icon,
}: StatCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                flex: 1,
                p: 3,
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                justifyContent: "space-between",
                fontFamily: "inherit",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}
        >
            <Box>
                <Typography sx={{ fontWeight: 500, fontFamily: "inherit", mb: 1, fontSize: 16, color: "text.secondary" }}>{title}</Typography>

                <Typography variant="h4" sx={{ fontWeight: 500, fontFamily: "inherit", fontSize: 32, mb: 2, color: "text.primary" }}>{value}</Typography>

                <Typography sx={{ fontWeight: 400, fontFamily: "inherit", fontSize: 12, color: "text.secondary" }}>{caption}</Typography>
            </Box>

            {icon}
        </Card>
    );
}

export default StatCard;