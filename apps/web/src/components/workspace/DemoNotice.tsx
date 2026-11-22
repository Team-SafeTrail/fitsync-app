import "server-only";
export default function DemoNotice(){
 if(process.env.FITSYNC_DEMO_MODE!=="true")return null;
 return <aside className="fitsync-demo-notice" role="note" aria-label="Môi trường demo"><strong>DỮ LIỆU MÔ PHỎNG · EXE201</strong><span>Tài khoản, số đo và giao dịch trong bộ demo không phải khách hàng, khảo sát hoặc doanh thu thật.</span></aside>;
}
