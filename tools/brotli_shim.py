# libbrotli を ctypes で呼ぶ最小の代用品（fontTools の woff2 用）
import ctypes, ctypes.util
_enc = ctypes.CDLL(ctypes.util.find_library('brotlienc') or 'libbrotlienc.so.1')
_dec = ctypes.CDLL(ctypes.util.find_library('brotlidec') or 'libbrotlidec.so.1')
MODE_GENERIC, MODE_TEXT, MODE_FONT = 0, 1, 2
def compress(data, mode=MODE_GENERIC, quality=11, lgwin=22, lgblock=0):
    n = len(data); cap = _enc.BrotliEncoderMaxCompressedSize(ctypes.c_size_t(n)) or n + 1024
    out = ctypes.create_string_buffer(cap); size = ctypes.c_size_t(cap)
    ok = _enc.BrotliEncoderCompress(quality, lgwin, mode, ctypes.c_size_t(n), data, ctypes.byref(size), out)
    if not ok: raise RuntimeError('brotli compress failed')
    return out.raw[:size.value]
def decompress(data):
    cap = max(len(data) * 20, 1 << 20)
    while True:
        out = ctypes.create_string_buffer(cap); size = ctypes.c_size_t(cap)
        r = _dec.BrotliDecoderDecompress(ctypes.c_size_t(len(data)), data, ctypes.byref(size), out)
        if r == 1: return out.raw[:size.value]
        cap *= 4
        if cap > 1 << 30: raise RuntimeError('brotli decompress failed')
class error(Exception): pass
