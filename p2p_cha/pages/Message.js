import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

export default function Message(props) {

    return (
        <Card variant='outlined'>
            <CardContent>
                <Typography variant='h9'> {props.name}</Typography>
                <Typography variant='h6'> {props.message}</Typography>
            </CardContent>
        </Card>
    )
}