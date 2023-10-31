import { JsonProperty } from 'json2typescript';

export class DriverDetail {

    constructor() {}
        @JsonProperty('Type', String)
        public Type: string = '';
        
        @JsonProperty('Carir_Nme', String)

        public Carir_Nme: string = '';

        @JsonProperty('Nme', String)

        public Nme: string | null = null;

       

        @JsonProperty('Lcns_Plt_Nmbr', String)

        public Lcns_Plt_Nmbr: string | null = null;

       

        @JsonProperty('Id_Img', String)

        public Id_Img: string | null = null;

       

        @JsonProperty('Rpnt', String)

        public Rpnt: string | null = null;

       

        @JsonProperty('ShptNmbr', String)

        public ShptNmbr: string | null = null;
}