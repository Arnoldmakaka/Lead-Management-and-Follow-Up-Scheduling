import React from 'react';

const MyModal = ({ show, handleClose, title, children }) => {
    return (
        <div
            className={`modal fade ${show ? 'show' : ''}`}
            style={{ display: show ? 'block' : 'none' }}
            tabindex="-1"
            aria-hidden="true"
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>

                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleClose}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default MyModal;
