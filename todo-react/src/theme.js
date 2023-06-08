import { createTheme } from "@mui/material";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";

const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

LinkBehavior.displayName = "LinkBehavior";

const baseTextColor = "#101828";
const primaryColor = "#468bd1";
const baseBorderColor = "#646F793D";
const baseFontSize = 14;

const theme = createTheme({
  components: {
    MuiDialogTitle: {
      defaultProps: {
        variant: "h2",
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
        disableRipple: true,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 2,
          fontSize: baseFontSize,
        },
      },
      variants: [
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            borderColor: "#00336629",
          },
        },
      ],
    },
    MuiInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${baseBorderColor}`,
          backgroundColor: "#ffffff",
          borderRadius: 4,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& legend": { display: "none" },
          "& fieldset": { top: 0 },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& legend": { display: "none" },
          "& .MuiOutlinedInput-root": {
            paddingRight: 0,
            "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
              top: 0,
              border: `1px solid ${baseBorderColor}`,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            padding: "8px 14px",
            backgroundColor: "#ffffff",
          },
          "label + &": {
            marginTop: 24,
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: baseFontSize,
          color: baseTextColor,
          transform: "unset !important",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "body1",
          fontWeight: 700,
        },
      },
      styleOverrides: {
        root: {
          padding: 24,
          paddingBottom: 0,
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        textColor: "secondary",
        indicatorColor: "secondary",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: 14,

          "&.Mui-selected": {
            fontSize: 20,
            fontWeight: 700,
          },
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        initialState: {
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        },
      },
      styleOverrides: {
        root: {
          border: "none",
          fontSize: baseFontSize,
          "& .MuiDataGrid-columnHeaders": {
            borderColor: "#EEEEF5",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 400,
            fontSize: 12,
            color: "#8A8C8E",
            whiteSpace: "normal",
            lineHeight: 1.3,
          },
          "& .MuiDataGrid-main": {
            marginTop: 10,
          },
          "& .MuiDataGrid-main, & .MuiDataGrid-footerContainer": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell": {
            paddingTop: 16,
            paddingBottom: 16,
            borderColor: "#EEEEF5",
            alignItems: "flex-start",
            "&:focus": {
              outline: "none!important",
            },
          },
          "& .MuiDataGrid-columnHeader": {
            "&:focus": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-cellCheckbox": {
            "&:focus-within": {
              outline: "none",
            },
          },
          "& .quickFilter .MuiInputBase-formControl": {
            paddingLeft: 12,
          },
          "& .quickFilter input": {
            paddingLeft: 4,
          },
          "& .MuiDataGrid-row": {
            "& .MuiDataGrid-actionsCell": {
              visibility: "hidden",
            },
            "&:hover .MuiDataGrid-actionsCell, & .MuiDataGrid-actionsCell:has(.active)":
              {
                visibility: "visible",
              },
          },
        },
      },
    },
  },
  palette: {
    text: {
      primary: baseTextColor,
      secondary: "#8A8C8E",
      disabled: "#C7C8CA",
    },
    common: {
      red: "#E11B22",
      gray: "#646F79",
      borderGray: baseBorderColor,
    },
    background: {
      default: "#F7F7FA",
    },
    success: {
      main: "#68B561",
      contrastText: "#ffffff",
    },
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: "#E11B22",
    },
  },
  typography: {
    fontFamily: ["Catamaran", "sans-serif"].join(","),
    fontSize: baseFontSize,
    h3: {
      fontSize: 24,
      fontWeight: 700,
    },
    h2: {
      fontSize: 28,
      fontWeight: 700,
    },
    h4: {
      fontSize: 20,
      fontWeight: 700,
    },
    h1: {
      fontSize: 40,
      fontWeight: 400,
    },
    caption: {
      fontSize: 12,
    },
    subtitle1: {
      fontSize: 16,
    },
  },
  shape: {
    borderRadius: 4,
  },
});

export default theme;
