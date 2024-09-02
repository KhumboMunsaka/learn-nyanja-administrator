import React from "react";

import InputForm from "../components/InputForm";
import DisplayWords from "../components/DisplayWords";
import { AddWordProvider } from "../contexts/AddWordContext";

function AdminForm() {
  return (
    <AddWordProvider>
      <InputForm />
      <DisplayWords />
    </AddWordProvider>
  );
}

export default AdminForm;
