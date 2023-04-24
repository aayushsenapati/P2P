import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const msgStyle =
    { width: '20%', minWidth: '10%', height:'auto', borderRadius: '20px', marginLeft: 'auto', marginTop: '10px', padding: '0px' }

export default function Message(props) {


    if (props.sender) {
        msgStyle.marginLeft = 'auto';
        msgStyle.color = 'blue';
    }
    else {
        msgStyle.marginLeft = '0px';
        msgStyle.color = 'green';
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Card variant='outlined' sx={msgStyle}>
                <CardContent sx={{
                    padding: '0px', "&:last-child": { paddingBottom: '0px' }, padding: '0px', paddingLeft: '20px', paddingBottom: '0px'
                }}>
                    <Typography variant='h9' sx={{ color: msgStyle.color, fontSize: '12px' }}> {props.name} </Typography>
                    <Typography variant='h6' sx={{ color: 'White', fontSize: '18px' }}> {props.message}</Typography>
                </CardContent>
            </Card>
        </Box>
    )
}