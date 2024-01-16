import { sendConfirmationMail } from "../middlewares/sendMail.js";
import {
  addNewApplicant,
  createNewJob,
  deleteJob,
  findJobById,
  getAllJobs,
  sendAllApplicants,
  updateJob,
} from "../models/job.model.js";

export default class JobControl {
  renderLandingPage = (req, res) => {
    res.render("landing-page", { user: req.session.user });
  };
  // Get jobs on list-all-jobs page 
  getJobs = (req, res) => {
    let jobs = getAllJobs();
    res.render("list-all-jobs", { jobs, user: req.session.user });
    
  };
  // Add new job
  newjob = (req, res) => {
    createNewJob(req.body);
    res.redirect("/jobs");
  };
  // Job form render
  renderJobForm = (req, res) => {
    res.render("new-job", { user: req.session.user });
  };
  // find job by id with details
  findJobById = (req, res) => {
    const id = req.params.id;
    const jobaData = findJobById(id);
    res.render("job-details", { data: jobaData, user: req.session.user });
  };
  // New applicant added 
  newApplicant = async (req, res) => {
    const id = req.params.id;
    const { name, email, contact } = req.body;
    const resumePath = req.file.filename;
    addNewApplicant(id, name, email, contact, resumePath);
    await sendConfirmationMail(email);
    res.redirect("/jobs");
  };
  // Applicants 
  allApplicants = (req, res) => {
    const id = req.params.id;
    const resp = sendAllApplicants(id);
    res.render("all-applicants", {
      allApplicants: resp,
      user: req.session.user,
    });
  };
  // Update form rendering
  renderUpdateform = (req, res) => {
    const id = req.params.id;
    const resp = findJobById(id);
    res.render("update-job", { job: resp });
  };
  // Update job 
  updateJobById = (req, res) => {
    const id = req.params.id;
    updateJob(id, req.body);
    res.redirect(`/job/${id}`);
  };
  // Delete job 
  deleteJob = (req, res) => {
    const id = req.params.id;
    deleteJob(id);
    res.redirect("/jobs");
  };
}
