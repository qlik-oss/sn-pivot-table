import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  nullCell: {
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: '#ccc',
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    width: '75px',
  },
  cell: {
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingLeft: 4,
    paddingRight: 4,
  },
  header: {
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    justifyContent: 'center',
  },
});

export default styles;
