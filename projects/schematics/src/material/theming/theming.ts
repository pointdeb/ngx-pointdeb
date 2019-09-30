export const createStylesContent = (_name: string = 'app') => {
return `
/* You can add global styles to this file, and also import other style files */
@import '~material-design-icons/iconfont/material-icons.css';
@import '~@angular/material/theming';

@include mat-core();

$${_name}-primary: mat-palette($mat-deep-purple);
$${_name}-accent:  mat-palette($mat-amber);
$${_name}-theme:   mat-dark-theme($${_name}-primary, $${_name}-accent);

// Include the default theme styles.
@include angular-material-theme($${_name}-theme);

html, body {
  height: 100%;
}

body {
  margin: 0;
}

.mat-drawer-inner-container {
  display: flex;
  flex-direction: column;
}

.mat-drawer-container {
  height: 100%;
}

.loader {
  display: flex;
  height: 100%;
  width: 100%;
  background: white;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
}

.navbar {
  box-shadow: 2px 4px 10px rgba(0,0,0,.2);
}
.navbar .active {
  font-weight: bold;
}
`;
};

export const getLoaderComponent = () => {
  return `<div class="loader">Loading...</div>`;
}
