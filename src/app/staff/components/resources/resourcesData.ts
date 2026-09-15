export const UCEDA_PDF_URL =
  'https://file.notion.com/f/f/b7a33847-fcb9-4dab-9f8a-b307eb4176b9/9eced387-d363-455c-a402-8df3e1a61bcf/Initial_F1-Application_UCEDA.pdf?table=block&id=196ead7e-2636-80d0-b1e3-d944337c51a9&spaceId=b7a33847-fcb9-4dab-9f8a-b307eb4176b9&expirationTimestamp=1789516800000&signature=u-O6O8GYFmTJrRfo8o1ueBih6w4gc5AnEM-BPlpmP1U&downloadName=Initial+F1-Application+UCEDA.pdf';

export const TALK_PDF_URL =
  'https://file.notion.com/f/f/b7a33847-fcb9-4dab-9f8a-b307eb4176b9/58ca4a2b-0fed-469d-8451-d50e0a427932/Booking_Form.pdf?table=block&id=196ead7e-2636-81e9-96bc-f81102e95f60&spaceId=b7a33847-fcb9-4dab-9f8a-b307eb4176b9&expirationTimestamp=1789516800000&signature=3z1IHEhG5plh_cfaUAWWYC6nrT0DASjY4zIHe0mrF-A&downloadName=Booking+Form.pdf';

export const PLANTILLA_SIN_GOCE_SUELDO_URL =
  'https://file.notion.com/f/f/b7a33847-fcb9-4dab-9f8a-b307eb4176b9/59accc34-e8d0-441e-ac1c-403224d1643b/PLANTILLA_SIN_GOCE_DE_SUELDO.pdf?table=block&id=261ead7e-2636-80c1-b9a8-d231e24c021a&spaceId=b7a33847-fcb9-4dab-9f8a-b307eb4176b9&expirationTimestamp=1789516800000&signature=GeRlUhRrOqdfEgt8XZGLyhJmLDnENNkYaTrLcQ_aI3M&downloadName=PLANTILLA+SIN+GOCE+DE+SUELDO.pdf';

export const PLANTILLA_CERTIFICADO_LABORAL_URL =
  'https://file.notion.com/f/f/b7a33847-fcb9-4dab-9f8a-b307eb4176b9/d50bbe12-43ca-4237-b76f-058dc5c939c5/PLANTILLA_CERTIFICADO_LABORAL.pdf?table=block&id=261ead7e-2636-80a5-ba0d-fbfeae73df1e&spaceId=b7a33847-fcb9-4dab-9f8a-b307eb4176b9&expirationTimestamp=1789516800000&signature=uWgEtCugC7GW9sKyns69VTWdDHolzLQC_jdzJWy7ol4&downloadName=PLANTILLA+CERTIFICADO+LABORAL.pdf';

export const SEVIS_FEE_URL = 'https://www.fmjfee.com/i901fee/index.html';
export const DS160_URL = 'https://ceac.state.gov/GenNIV/Default.aspx';
export const AIS_PORTAL_URL = 'https://ais.usvisa-info.com/';
export const I94_PORTAL_URL = 'https://i94.cbp.dhs.gov/home';
export const LUMOS_PORTAL_URL = 'https://app202201.lumos.edu/';
export const MILA_JOTFORM_URL = 'https://form.jotform.com/221354579054155';

export const EMAIL_BODY_TEMPLATE = `Estimada (Nombre Postulante),

Adjunto documentación para el dia de tu entrevista.

Adicionalmente, se muestra una lista de los documentos que debes tener en tu carpeta numero 1 y carpeta numero 2.

Primera Carpeta:
1. Pasaporte (tuyo y de tus dependientes (F2 si aplica))
2. I20 (Tuyo y de tus dependientes si aplica)
   * Firmarlo en la primera hoja donde aparece nombre completo y poner fecha de cuando recibiste el I20 (revisar tu correo electrónico para ver la fecha).
3. Carta de Aceptacion de la escuela
4. Recibo del pago de la cuota SEVIS
5. Pagina de confirmacion del DS160
6. Declaracion Bancaria (tuya o de tu patrocinador) que muestre la misma cantidad que declaraste tener durante el proceso de aplicacion.
7. Recibo de pago de la entrevista
8. Dos fotos impresa tamaño ID (5x5)
9. Incluir en esta carpeta certificado de matrimonio (si aplica)
10. Incluir en esta carpeta certificado de nacimiento (de tus hijos) (Si aplica)
* DEBERAS FIRMAR LA PRIMERA HOJA DE TU I20 Y LA FECHA EN QUE LO RECIBISTE.

Segunda Carpeta (Documentos Adicionales):
1. Certificado de Empleo: Documento o carta que demuestra que actualmente te encuentras laborando, indica el cargo que desempeñas, tu antigüedad laboral, tu sueldo mensual, etc.
2. Adicional al documento número 1, incluye un documento o carta donde se indique que tu empleador está interesado en mantener tu contrato vigente durante el tiempo que te encuentres estudiando. Una carta donde se indique que te concede un permiso especial sin goce de sueldo durante el periodo de estudios en USA.
3. Si te encuentras estudiando, lleva un documento que demuestre que estás asistiendo a ese programa.
4. En caso que poseas bienes, propiedades y/o negocios, lleva documentos que demuestren que eres el dueño (esto aplica para tus bienes y para que Belsaid presente un documento que indique que arrendó su negocio y que VOLVERÁ).
5. Declaración de impuestos (si lo tienes).

Memoriza el orden que pusiste tus documentos para que se los entregues con facilidad a la persona que te está entrevistando. No muestres nerviosismo.

Si tienes cualquier duda o consulta, por favor no dudes en contactarme.

Saludos,
Karen Oyarce
Departamento de Postulaciones
Udreamms LLC`;

export type SchoolType = 'lumos' | 'mila' | 'uceda' | 'talk';

export interface SchoolDefinition {
  id: SchoolType;
  name: string;
  badge: string;
  badgeColor: string;
  location: string;
  actionSummary: string;
}

export const SCHOOLS_LIST: SchoolDefinition[] = [
  {
    id: 'lumos',
    name: 'Lumos Language School',
    badge: 'Utah (UDREAMMS)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    location: 'Salt Lake City & Orem, Utah',
    actionSummary: 'Portal Web + Código UDREAMMS'
  },
  {
    id: 'mila',
    name: 'MILA International Language Academy',
    badge: 'Orlando, Florida',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    location: 'Orlando, Florida',
    actionSummary: 'JotForm + Agente Valentina Vega'
  },
  {
    id: 'uceda',
    name: 'UCEDA International',
    badge: 'Envío por Email',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    location: 'Campus Multi-Estado, EE.UU.',
    actionSummary: 'Formulario PDF + Correo Admisiones'
  },
  {
    id: 'talk',
    name: 'TALK English Schools',
    badge: 'Envío por Email',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    location: 'Miami, Fort Lauderdale, Boston, San Francisco, Atlanta',
    actionSummary: 'Booking Form PDF + Correo Admisiones'
  }
];
