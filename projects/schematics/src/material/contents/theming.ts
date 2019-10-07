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

.main-container {
  padding: 0 16px;
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
  return `
<style>
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
</style>
<div class="loader">Loading...</div>
`;
};

export const getAppComponentContent = (old_content: string = '', preservePlaceholder: boolean = false) => {
return `
${ preservePlaceholder !== true ? '<div style="display: none">' + old_content + ' </div>' : ''}
<mat-drawer-container>
  <mat-drawer-content>
    <mat-toolbar color="primary">
      <img width="40" alt="Angular Logo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="/>
      <a [routerLink]="['/']" mat-button>{{title | titlecase}}</a>
      <a [routerLink]="['/icons']" mat-button>Icons</a>
    </mat-toolbar>
    <div class="main-container">
      <router-outlet></router-outlet>${preservePlaceholder !== true ? '' : old_content}
    </div>
  </mat-drawer-content>
</mat-drawer-container>
`;
};
