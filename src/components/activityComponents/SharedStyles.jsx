import { Box, Container, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Page Container with consistent padding and max width
export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

// Header Section with consistent styling
export const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(5),
  maxWidth: "800px",
  "& h2": {
    fontSize: "1.875rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    lineHeight: 1.3,
  },
  "& p": {
    fontSize: "1rem",
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    margin: 0,
  },
}));

// Form Container with consistent width and spacing
export const FormContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  "& .form-section": {
    marginBottom: theme.spacing(4),
  },
  "& .form-label": {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    display: "block",
  },
  "& .form-hint": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
    fontStyle: "italic",
    marginBottom: theme.spacing(2),
    display: "block",
  },
}));

// Footer Buttons Container
export const FooterButtons = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(6),
  gap: theme.spacing(2),
  "& button": {
    minWidth: "120px",
    padding: theme.spacing(1.25, 3),
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "none",
  },
}));

// Card Container for grouped content
export const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

// Option Box for radio/checkbox options
export const OptionBox = styled(Box)(({ theme, selected }) => ({
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  backgroundColor: selected ? theme.palette.primary.light + "08" : "transparent",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + "08",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  "& .MuiRadio-root": {
    padding: theme.spacing(1),
  },
}));

// Option Text Content
export const OptionContent = styled(Box)(({ theme }) => ({
  flex: 1,
  "& h5": {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    margin: 0,
    marginBottom: theme.spacing(0.5),
  },
  "& span": {
    fontSize: "0.9375rem",
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },
}));

// Field Group for form fields
export const FieldGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  "& > *": {
    flex: 1,
    minWidth: "200px",
  },
}));

// Section Title
export const SectionTitle = styled(Box)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

// Info Box for helpful information
export const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.info.light + "15",
  borderLeft: `4px solid ${theme.palette.info.main}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

// Modal styles with improved design
export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(90vw, 900px)",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  borderRadius: 2,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

export const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  p: 3,
  borderBottom: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.default",
};

export const modalBody = {
  p: 3,
  overflowY: "auto",
  flex: 1,
};

export const modalFooter = {
  display: "flex",
  justifyContent: "space-between",
  gap: 2,
  p: 3,
  borderTop: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.default",
};
