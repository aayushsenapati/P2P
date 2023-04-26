import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';


const msgStyle =
    { maxWidth: '45%', height: 'auto', borderRadius: '12px', marginLeft: 'auto', marginTop: '10px', padding: '5px' }

const nameStyle = { color: msgStyle.color, fontSize: '12px' }

export default function Message(props) {

    if (props.isFirstMes) {
        nameStyle.display = 'block';
        msgStyle.marginTop = '10px';
        if (props.sender) {
            msgStyle.borderTopLeftRadius = '12px';
            msgStyle.borderTopRightRadius = '2px';
        }
        else {
            msgStyle.borderTopLeftRadius = '2px';
            msgStyle.borderTopRightRadius = '12px';
        }
    }
    
    else {
        nameStyle.display = 'none';
        msgStyle.marginTop = '3px'
        msgStyle.borderTopLeftRadius = '12px';
        msgStyle.borderTopRightRadius = '12px';
    }
    if (props.sender) {
        msgStyle.marginLeft = 'auto';
        msgStyle.color = 'skyblue';
        msgStyle.borderColor = 'skyblue';
    }
    else {
        msgStyle.marginLeft = '0px';
        msgStyle.color = props.color;
        msgStyle.borderColor = props.color;
    }
    return (
        <Box sx={{ width: '100%', display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex' }}>
                <Card variant='outlined' sx={msgStyle}>
                    <CardContent sx={{
                        padding: '0px', "&:last-child": { paddingBottom: '0px' }, padding: '0px 10px 0px 10px',
                    }}>
                        <Typography variant='h9' sx={nameStyle}>
                            {props.name}
                        </Typography>
                        <Typography variant='h6' sx={{ flexBasis: '30%', wordWrap: 'break-word', width: '100%', color: 'White', fontSize: '18px' }}>
                            {props.message}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}