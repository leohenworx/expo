#pragma once

#include <shared_mutex>
#include "EXGLNativeContext.h"

namespace expo {
namespace gl_cpp {

using ContextWithLock = std::pair<EXGLContext *, std::shared_lock<std::shared_mutex>>;

EXGLContextId ContextCreate();
void ContextMarkReady(EXGLContextId id);
void ContextMarkPrepareStart(EXGLContextId id);
ContextWithLock ContextGet(EXGLContextId id);
void ContextDestroy(EXGLContextId id);

} // namespace gl_cpp
} // namespace expo
