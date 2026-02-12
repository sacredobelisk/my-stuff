import { LocalDate, Year } from "@js-joda/core";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Job } from "./components/job";
import { ResumeSection } from "./components/resume-section";

const comcastStartDate = LocalDate.of(2000, 12, 7);

const calculateYearsSinceFirstJob = () => Year.now().value() - comcastStartDate.year();

export const ResumePage = () => {
  return (
    <Stack spacing={4}>
      <ResumeSection title="Professional Summary">
        <Stack spacing={2}>
          <Typography>
            With {calculateYearsSinceFirstJob() - 6} years of front-end development experience, I specialize in building
            robust internet applications using HTML, CSS, JavaScript, and React. I bring strong conceptual thinking,
            business acumen, and analytical expertise to every project. Known for being a collaborative team player, I
            quickly absorb new concepts and apply them effectively. My organizational and interpersonal skills support
            seamless communication and project execution.
          </Typography>

          <Typography>
            On the back end, I have 6 years of experience in the analysis, design, development, administration, and
            documentation of enterprise-level business applications using Java. I am well-versed in Object-Oriented
            Analysis and Design (OOA&D), with practical knowledge of design patterns including Singleton and Factory.
          </Typography>
        </Stack>
      </ResumeSection>

      <ResumeSection title="Skills">
        <List sx={{ m: 0 }} disablePadding>
          <ListItem>
            <Typography>JavaScript, React, Material UI</Typography>
          </ListItem>
          <ListItem>
            <Typography>HTML, CSS</Typography>
          </ListItem>
          <ListItem>
            <Typography>GIT, Photoshop</Typography>
          </ListItem>
          <ListItem>
            <Typography>Claude, Copilot</Typography>
          </ListItem>
        </List>
      </ResumeSection>

      <ResumeSection title="Personal Projects">
        <List sx={{ m: 0 }} disablePadding>
          <ListItem disablePadding>
            <Link href="https://www.allisonweinreb.com/" rel="noopener noreferrer" target="_blank" variant="body1">
              Allison O&apos;Brien
            </Link>
            <Typography>&nbsp;- A personal website showcasing Ally&apos;s portfolio and projects.</Typography>
          </ListItem>
        </List>
      </ResumeSection>

      <ResumeSection title="Professional Experience">
        <Stack spacing={4}>
          <Job company="Red Rover" dates={{ start: LocalDate.of(2025, 12, 8) }} title="Senior Software Engineer" />

          <Job
            company="Vertex, Inc"
            dates={{ start: LocalDate.of(2019, 10, 28), end: LocalDate.of(2025, 12, 5) }}
            title="Senior Software Developer"
          >
            <Typography>
              Contributed to the development of tax software built with React, including integrating a design system to
              ensure consistency and maintainability across the company&apos;s applications. In addition to hands-on
              coding, I mentor team members by sharing best practices and guiding architectural decisions. I also
              conduct thorough code reviews to uphold quality standards and foster collaborative growth within the team.
            </Typography>
          </Job>

          <Job
            company="Frontline Education"
            dates={{ start: LocalDate.of(2015, 11, 18), end: LocalDate.of(2019, 10, 25) }}
            title="Software Developer"
          >
            <Typography>
              Part of a team to create a new application to allow users to manage their employees, forms, dashboard, and
              list configuration. Created many of the reusable components used by the team to layout and build the
              employee profile pages and form builder pages.
            </Typography>
          </Job>

          <Job
            company="Reactor One, LLC"
            dates={{ start: LocalDate.of(2014, 12, 8), end: LocalDate.of(2015, 11, 15) }}
            title="Software Engineer"
          >
            <Typography>
              Collaborated on the development of a new application designed to help users manage employees, forms,
              dashboards, and list configurations. Engineered a suite of reusable components that streamlined the
              creation of employee profile pages and form builder interfaces, enhancing consistency and development
              efficiency across the team.
            </Typography>
          </Job>

          <Job
            company="DiTech"
            dates={{ start: LocalDate.of(2014, 11, 4), end: LocalDate.of(2014, 12, 5) }}
            title="Software Developer"
          >
            <Typography>Updated site with new content and new features.</Typography>
          </Job>

          <Job
            company="eBay Enterprise"
            dates={{ start: LocalDate.of(2012, 4, 20), end: LocalDate.of(2014, 10, 24) }}
            title="Senior Web Developer"
          >
            <Typography>
              Worked across multiple sites, such as GNC, Sony, Dick&apos;s Sporting Goods, ACE Hardware, and The Sports
              Authority to implement a cart/checkout redesign, new mobile site, and product page redesigns. All sites
              had modern cross-browser support while the new mobile site was written in Angular 1.
            </Typography>
          </Job>

          <Job
            company="G2"
            dates={{ start: LocalDate.of(2011, 6, 20), end: LocalDate.of(2012, 4, 17) }}
            title="Manager, Interface Engineer"
          >
            <Typography>
              Worked on multiple consumer brand sites such as Hertz, Smuckers, Campbell&apos;s, and Merck to provide
              content updates, redesigns, and modern cross-browser support. In addition to modern browser support, Merck
              also needed Internet Explorer 6 support.
            </Typography>
          </Job>

          <Job
            company="AST Equity Plan Solutions"
            dates={{ start: LocalDate.of(2010, 9, 20), end: LocalDate.of(2011, 6, 17) }}
            title="Java Web Developer"
          >
            <Typography>
              Enhanced pages to use newer libraries to make page rendering faster and more efficient. Worked on a team
              to deliver the first phase of internationalization.
            </Typography>
          </Job>

          <Job
            company="GSI Commerce Inc."
            dates={{ start: LocalDate.of(2007, 7, 16), end: LocalDate.of(2010, 9, 17) }}
            title="Senior Web Developer"
          >
            <Typography>
              Worked across multiple sites, such as Aéropostale, Palm, Nickelodeon, and many others to implement
              redesigns, update content, add new features to enhance the customer shopping experience.
            </Typography>
          </Job>

          <Job
            company="Comcast"
            dates={{ start: comcastStartDate, end: LocalDate.of(2007, 7, 13) }}
            title="Software Engineer"
          >
            <Typography>
              Created a software layer to connect to a third-party company, thePlatform, to pull down video metadata and
              output in XML the Fan
              <Typography component="sup" sx={{ fontSize: "0.7rem", verticalAlign: "super" }}>
                TM
              </Typography>{" "}
              would be able to read. Also added UI screens to the admin interface to improve the editors&apos; workflow.
              Provided content changes and new features to the Comcast.net portal.
            </Typography>
          </Job>
        </Stack>
      </ResumeSection>
    </Stack>
  );
};
