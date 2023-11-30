import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;
const CATEGORY = 'Authentication Server';

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${formatTimestamp(timestamp)} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [new transports.Console()],
});

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  return formattedDate;
}

export default logger;
