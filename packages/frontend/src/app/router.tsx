import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import { Route } from "@mui/icons-material";
import { Videos } from "../pages/videos";

export const AppRouter: React.FC = observer(() => {
  return (
    <BrowserRouter>
      <Route path="/videos">
        <Videos />
      </Route>
    </BrowserRouter>
  );
});
