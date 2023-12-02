import { JsonProperty } from 'json2typescript';
interface WeightArrayItem {
    wght: number;
    rcptNmbr: string;
    shptNmbr: string;
    wunit:string;
    ptype:string;
    qnty:number;
  }
  interface DimensionArrayItem{
    lngth: number;
    width:number;
    height:number;
    rcptNmbr: string;
    shptNmbr: string;
    dunit:string;
    ptype:string;
    qnty:number;
  }
   interface ReceiptNumberArrayItem
  {
    RcptNmbr:string;
  }
export class Shipment {

    constructor() {}
        @JsonProperty('Name', String)

        public Name: string = '';
        @JsonProperty('ShptNmbr', String)

        public ShptNmbr: string = '';

        @JsonProperty('Locn', String)

        public Locn: string | null = null;

       

        @JsonProperty('Note', String)

        public Note: string | null = null;

       

        @JsonProperty('Imgs', String)

        public Imgs: string | null = null;

       

        @JsonProperty('Rpnt', String)

        public Rpnt: string | null = null;

       

        @JsonProperty('CstmRpnt', String)

        public CstmRpnt: string | null = null;

        @JsonProperty('Qnty', Number)

        public Qnty: number | null = null;
        
        @JsonProperty('Sts', String)

        public Sts: string | null = null; 
         RcptNmbr: ReceiptNumberArrayItem[] =[];
         WeightCollection:WeightArrayItem[]=[];
         DimensionCollection:DimensionArrayItem[]=[];      
}