import { UnitMaterial } from "./UnitMaterialInterface";

export type Unit = {
  id: number;
  number: number;
  name: string;
  description: string | null;
  subjectId: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;

  unitMaterial: UnitMaterial[];
};
