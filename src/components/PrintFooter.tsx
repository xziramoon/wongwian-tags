import { useQueueStore } from '../store/queueStore';

export default function PrintFooter() {
  const clearQueue = useQueueStore((s) => s.clearQueue);

  return (
    <div className="sb-foot">
      <div className="foot-cap">
        <span className="step-no">3</span> เสร็จแล้วกดพิมพ์ลงกระดาษ A4
      </div>
      <button className="btn btn-print" onClick={() => window.print()}>
        ⎙ &nbsp;พิมพ์ป้ายราคา
      </button>
      <button className="btn btn-clear" onClick={clearQueue}>
        ✕ ล้างรายการทั้งหมด
      </button>
    </div>
  );
}
