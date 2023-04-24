import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

export default function Message(props) {

    if(props.sender)
        return (
            <Box sx={{width:'100vw'}}>
                <Card variant='outlined' sx={{width:'30vw', maxWidth:'50vw', borderRadius:'20px', marginLeft:'auto', marginTop:'10px', padding:'0px'}}>
                    <CardContent sx={{padding:'0px', paddingLeft:'20px', paddingBottom:'0px' }}>
                        <Typography variant='h9' sx={{color:'green', fontSize:'12px'}}> {props.name} </Typography>
                        <Typography variant='h6' sx={{color:'White', fontSize:'18px'}}> {props.message}</Typography>
                    </CardContent>
                </Card>
            </Box>
        )
    else
        return (
            <Box sx={{width:'100vw'}}>
                <Card variant='outlined' sx={{width:'30vw', maxWidth:'50vw', borderRadius:'20px', marginTop:'10px', padding:'0px'}}>
                    <CardContent sx={{padding:'0px', paddingLeft:'20px', paddingBottom:'0px' }}>
                        <Typography variant='h9' sx={{color:'blue', fontSize:'12px'}}> {props.name} </Typography>
                        <Typography variant='h6' sx={{color:'White', fontSize:'18px'}}> {props.message}</Typography>
                    </CardContent>
                </Card>
            </Box>
        )
}