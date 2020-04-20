import { makeStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },

  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },

  heading: {
  },

  button: {
    margin: theme.spacing(1),
  },

  chart: {
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(3),

    '& .empty-message': {
      height: '250px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  predictionsTable: {
    marginBottom: theme.spacing(5),
  },

  patternCell: {
    wordBreak: 'break-all',
    '@media (min-width:600px)': {
      fontSize: 10,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },

  today: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  saveMessage: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },

  striped: {
    background: blueGrey['50'],
    color: theme.palette.getContrastText(blueGrey['50']),
  },
}));

export default useStyles;
