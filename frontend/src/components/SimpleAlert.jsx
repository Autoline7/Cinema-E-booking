import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function SimpleAlert({message}){
  return (
    <Alert className='alert' icon={<CheckIcon fontSize="inherit" />} severity="success">
      {message}
    </Alert>
  );
}
