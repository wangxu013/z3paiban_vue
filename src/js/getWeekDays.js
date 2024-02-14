/**
 * 返回七天一周的日期，从星期一算到星期日。
 * @param {string} dateStr 有日期的字符串，例如"01/23/2024-sss"
 * @returns {Date[]} 一周的日期数组:["2024-01-22","2024-01-23",...]
 */
function getWeekDates(dateStr) {
  // 将日期字符串转换为 Date 对象
  const date = new Date(dateStr);

  // 获取日期所在的星期
  const dayOfWeek = date.getDay();

  // 获取该周的周一日期
  const mondayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek + 1);

  // 返回该周的所有日期
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + i));
  }

  return weekDates;
}
/**
 * 返回星期的数字。
 * @param {string} dateStr 表示星期的字符串。"mon","SUNDAY--"
 * @returns {number} 返回星期的数字:1或2...或7。
 */
function getWeekDayNumber(dateStr) {
  dateStr = dateStr.slice(0, 3);  //获取前三个字母
  dateStr = dateStr.toLowerCase(); // 转换为小写
  switch (dateStr) {
    case "mon":
      return 1;
    case "tue":
      return 2;
    case "wed":
      return 3;
    case "thu":
      return 4;
    case "fri":
      return 5;
    case "sat":
      return 6;
    case "sun":
      return 7; // 星期日返回 7
    default:
      return null; // 不匹配时返回 null
  }
}
/**
 * 获取当前日期是哪周的中文
 * @param {Date} date 日期对象
 * @returns '上周','本周','下周','日期string'
 */
function getWeekStr(date) {
  // 将日期对象转换为 Date 对象，以便获取日期所在的星date = new Date(date); 
  date = new Date(date);
  // 获取当前日期是星期几
  let today = new Date();
  let dayOfWeek = today.getDay();
  // 将星期日转换为 7，以便计算上周一的日期
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; 
  // 获取本周一的日期
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + 1);
  // 获取下周一的日期
  const nextMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
  // 获取上周一的日期（上周一的日期就是上周末的日期）
  const lastMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7);
  // 获取下周一的日期（下周一的日期就是下周末的日期）
  const afterNextMonday = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + 7);

  // 判断日期是否在本周
  if (date >= monday && date < nextMonday) {
    return "本周";
  }

  // 判断日期是否在上周
  if (date >= lastMonday && date < monday) {
    return "上周";
  }

  // 判断日期是否在下周
  if (date >= nextMonday && date < afterNextMonday) {
    return "下周";
  }

  // 日期不在本周、上周或下周
  return date.toLocaleDateString();
}

export { getWeekDates, getWeekDayNumber,getWeekStr };

