interface ToastOptions {
  title?: string;
  message?: string;
  timeout?: number; // ms to auto-dismiss
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  progressBarColor?: string;
  onClose?: () => void;
}

const TOAST_CONTAINER_ID = 'toast-container';

function createToastContainer(position: ToastOptions['position'] = 'topRight') {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.maxWidth = '300px';
    container.style.pointerEvents = 'none'; // So clicks pass through container

    // Position container
    switch (position) {
      case 'topLeft':
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.alignItems = 'flex-start';
        break;
      case 'topRight':
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.alignItems = 'flex-end';
        break;
      case 'bottomLeft':
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.alignItems = 'flex-start';
        break;
      case 'bottomRight':
      default:
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.alignItems = 'flex-end';
        break;
    }
    document.body.appendChild(container);
  }
  return container;
}

export const Toast = (() => {
  function showToast(config: ToastOptions) {
    const container = createToastContainer(config.position);

    // Create toast element
    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.style.pointerEvents = 'auto'; // enable click events on toast
    toast.style.backgroundColor = config.backgroundColor || '#4caf50'; // default green
    toast.style.color = config.textColor || 'white';
    toast.style.minWidth = '280px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    toast.style.borderRadius = '6px';
    toast.style.overflow = 'hidden';
    toast.style.fontFamily = 'Arial, sans-serif';
    toast.style.cursor = 'pointer';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.display = 'flex';
    toast.style.flexDirection = 'column';

    // Header (title + close button)
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '10px 15px 5px 15px';

    const title = document.createElement('strong');
    title.textContent = config.title || 'Notification';
    title.style.color = config.titleColor || 'white';
    title.style.fontSize = '16px';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = config.titleColor || 'white';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.padding = '0';
    closeBtn.style.marginLeft = '10px';
    header.appendChild(closeBtn);

    // Body (message)
    const message = document.createElement('div');
    message.textContent = config.message || '';
    message.style.padding = '0 15px 10px 15px';
    message.style.fontSize = '14px';
    message.style.color = config.textColor || 'white';

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = config.progressBarColor || 'rgba(255, 255, 255, 0.7)';
    progressBar.style.width = '100%';
    progressBar.style.transition = `width ${config.timeout ?? 4000}ms linear`;

    toast.appendChild(header);
    toast.appendChild(message);
    toast.appendChild(progressBar);

    container.appendChild(toast);

    // Trigger show animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    // Animate progress bar shrinking
    requestAnimationFrame(() => {
      progressBar.style.width = '0%';
    });

    // Close function
    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.pointerEvents = 'none';

      setTimeout(() => {
        toast.remove();
        config.onClose?.();
        // Remove container if empty
        if (container.children.length === 0) container.remove();
      }, 300);
    };

    // Auto-remove after timeout
    const timeout = setTimeout(removeToast, config.timeout ?? 4000);

    // Close on click close button
    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      removeToast();
    });

    // Also close on click toast (optional)
    toast.addEventListener('click', () => {
      clearTimeout(timeout);
      removeToast();
    });
  }

  return {
    success(options: Partial<ToastOptions> = {}) {
      showToast({
        title: 'Success',
        backgroundColor: '#4caf50',
        progressBarColor: '#a5d6a7',
        ...options,
      });
    },
    warning(options: Partial<ToastOptions> = {}) {
      showToast({
        title: 'Warning',
        backgroundColor: '#f44336',
        progressBarColor: '#ef9a9a',
        ...options,
      });
    },
    info(options: Partial<ToastOptions> = {}) {
      showToast({
        title: 'Info',
        backgroundColor: '#2196f3',
        progressBarColor: '#90caf9',
        ...options,
      });
    },
    show(options: ToastOptions) {
      showToast(options);
    },
  };
})();


interface FloatingActionButtonOptions {
  text?: string;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
  color?: string;
  target?:Node;
  icon?:Node;
  onclick?: () => void;
}

export const FloatingActionButton = (() => {
  function renderButton(config: FloatingActionButtonOptions) {
    const button = document.createElement('button');
    button.classList.add('floating');
    button.innerHTML =  config.icon == null ? (config.text  || '<strong style="font-size: 22pt;">+</strong>') : '';
    button.style.position = 'fixed';
    button.style.top = config.position?.includes('top') ? '30px' : 'auto';
    button.style.bottom = config.position?.includes('bottom') ? '80px' : 'auto';
    button.style.left = config.position?.includes('Left') ? '30px' : 'auto';
    button.style.right = config.position?.includes('Right') ? '30px' : 'auto';
    button.style.color = config.color || 'white';
    button.style.backgroundColor = config.backgroundColor || 'plum';
    (config.icon == null) ? null : button.appendChild(config.icon)
    button.addEventListener('click', () => {
      config.onclick?.();
      button.style.backgroundColor = 'grey';
      setTimeout(() => {
        button.style.backgroundColor = config.backgroundColor || 'plum';
      }, 200);
    });

    config.target!.appendChild(button);
  }

  return {
    create(config: FloatingActionButtonOptions = {}) {
      renderButton(config);
    },
  };
})();

interface ListTileOptions {
  title?: string;
  leading?: string;
  trailing?: string;
  iconColor?: string;
  actionColor?: string;
  titleColor?: string;
  onTrailingClick?: () => void;
}

export const ListTile = (() => {
  function showTile(config: ListTileOptions) {
    const listTile = document.createElement('div');
    const leading = document.createElement('p');
    const trailing = document.createElement('p');
    const title = document.createElement('p');

    listTile.appendChild(leading);
    listTile.appendChild(title);
    listTile.appendChild(trailing);

    document.body.appendChild(listTile);

    leading.textContent = config.leading || '';
    title.textContent = config.title || '';
    trailing.textContent = config.trailing || '';

    leading.style.color = config.iconColor || 'black';
    trailing.style.color = config.actionColor || 'black';
    title.style.color = config.titleColor || 'black';

    leading.classList.add('leading');
    trailing.classList.add('trailing');
    title.classList.add('title');
    listTile.classList.add('listtile');

    trailing.addEventListener('click', () => {
      config.onTrailingClick?.();
    });
  }

  return {
    create(config: ListTileOptions = {}) {
      showTile(config);
    },
  };
})();

interface ContainerOptions {
  width?: string;
  height?: string;
  borderRadius?: string;
  border?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  item1?: HTMLElement | null;
  item2?: HTMLElement | null;
  item3?: HTMLElement | null;
  item4?: HTMLElement | null;
}

export const Container = (() => {
  function displayContainer(config: ContainerOptions) {
    const div = document.createElement('div');
    div.classList.add('con');

    div.style.width = config.width || '100%';
    div.style.height = config.height || '200px';
    div.style.border = config.border || 'none';
    div.style.padding = config.padding || '5px';
    div.style.margin = config.margin || '0';
    div.style.borderRadius = config.borderRadius || '0';
    div.style.backgroundColor = config.backgroundColor || 'white';

    [config.item1, config.item2, config.item3, config.item4].forEach((item) => {
      if (item instanceof HTMLElement) {
        div.appendChild(item);
      }
    });

    document.body.appendChild(div);
  }

  return {
    create(config: ContainerOptions = {}) {
      displayContainer(config);
    },
  };
})();

interface BottomSheetOptions {
  width?: string;
  height?: string;
  type?: 'message' | 'list';
  message?: string;
  list?: string[];
  link?: string[];
}

export const BottomSheet = (() => {
  function showSheet(config: BottomSheetOptions) {
    // Remove existing bottom sheet if any
    const existingSheet = document.querySelector('.bottom-sheet');
    if (existingSheet) existingSheet.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay fixed inset-0 bg-black opacity-half z-40';

    // Create sheet container
    const div = document.createElement('div');
    div.style.width = config.width || '100%';
    div.style.height = config.height || '50vh';
    div.className = 'bottom-sheet rounded-edges-top shadow-xl flex flex-col fixed bottom-0 bg-white z-50 justify-center slide-up';

    if (config.type === 'message') {
      const h5 = document.createElement('h5');
      h5.textContent = config.message || 'Add text here';
      div.appendChild(h5);
      h5.classList.add('text-center');
    } else if (config.type === 'list' && config.list) {
      config.list.forEach((item, idx) => {
        const anchor = document.createElement('a');
        anchor.textContent = item;
        anchor.href = config.link?.[idx] || '#';
        anchor.target = '_blank';
        anchor.className = 'block p-2 text-black hover-text no-underline';
        div.appendChild(anchor);
      });
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'mt-auto bg-grey text-white p-1 rounded border-none w-50';
    closeButton.addEventListener('click', () => {
      div.remove();
      overlay.remove();
    });

    div.appendChild(closeButton);
    document.body.appendChild(overlay);
    document.body.appendChild(div);
  }

  return {
    show(config: BottomSheetOptions = {}) {
      showSheet(config);
    },
  };
})();
