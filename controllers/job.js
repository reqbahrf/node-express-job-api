const getAllJobs = (req, res) => {
  res.send('All jobs router');
};
const getJob = (req, res) => {
  res.send('Get job router');
};

const createJob = (req, res) => {
  res.send('Create job router');
};

const updateJob = (req, res) => {
  res.send('Update job router');
};

const deleteJob = (req, res) => {
  res.send('Delete job router');
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
