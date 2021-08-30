const osu = require("node-os-utils");

const sysmonitor = {
  getSysStats: async () => {
    return Promise.all([sysmonitor.getCpuUsage(), sysmonitor.getMemoryUsage()])
      .then((stats) => {
        return { cpu_usage: stats[0], memory: stats[1] };
      })
      .catch((err) => {
        console.log(error);
      });
  },

  getCpuUsage: async () => {
    return osu.cpu.usage().then((result) => {
      return Math.round(result);
    });
  },

  getMemoryUsage: async () => {
    return osu.mem.used().then((result) => {
      result.totalMemMb = Math.round(result.totalMemMb);
      result.usedMemMb = Math.round(result.usedMemMb);
      return result;
    });
  },
};

module.exports = {
  sysmonitor,
};
